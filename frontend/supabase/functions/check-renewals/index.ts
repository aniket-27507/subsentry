// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions/deploy
// Deno runtime

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all active subscriptions
    // In a real app, you might want to filter by date in the query for performance
    // But since reminder_days_before varies per subscription, we fetch active ones and filter
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*, profiles(email, full_name)')
      .in('status', ['active', 'trial'])
      .eq('reminder_enabled', true)

    if (error) throw error

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const emailsToSend = []

    for (const sub of subscriptions) {
      // Determine the target date (renewal or trial end)
      let targetDateString = sub.next_renewal_date;
      let dateLabel = 'renew on';
      
      if (sub.status === 'trial') {
          if (!sub.trial_end_date) continue;
          targetDateString = sub.trial_end_date;
          dateLabel = 'end trial on';
      }
      
      if (!targetDateString) continue

      const targetDate = new Date(targetDateString)
      targetDate.setHours(0, 0, 0, 0)

      // Calculate reminder date
      const reminderDate = new Date(targetDate)
      reminderDate.setDate(targetDate.getDate() - (sub.reminder_days_before || 7))

      // Check if today is the reminder date
      if (reminderDate.getTime() === today.getTime()) {
         // Prepare email
         emailsToSend.push({
             from: 'SubSentry <onboarding@resend.dev>', // Change to your verified domain in production
             to: [sub.profiles.email],
             subject: sub.status === 'trial' 
                ? `Trial Ending Soon: ${sub.name}` 
                : `Renewing Soon: ${sub.name}`,
             html: `
               <h1>${sub.status === 'trial' ? 'Trial Ending Reminder' : 'Subscription Renewal Reminder'}</h1>
               <p>Hi ${sub.profiles.full_name || 'there'},</p>
               <p>Your subscription for <strong>${sub.name}</strong> is set to ${dateLabel} <strong>${targetDateString}</strong>.</p>
               <p>Amount: ${sub.currency} ${sub.amount}</p>
               <p>manage your subscriptions in SubSentry.</p>
             `
         })
      }
    }

    // Send emails in batches or individually
    // For simplicity, loop and fetch (Resend has a batch API too)
    const results = []
    for (const email of emailsToSend) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify(email)
      })
      const data = await res.json()
      results.push(data)
    }

    return new Response(
      JSON.stringify({ success: true, sent: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

