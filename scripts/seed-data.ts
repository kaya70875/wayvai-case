import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  const creators = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'creators.json'), 'utf8'))
  const campaigns = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'campaigns.json'), 'utf8'))

  console.log('Loading data...')

  const { error: creatorError } = await supabase.from('creators').upsert(creators)
  if (creatorError) console.error('Creator error:', creatorError)

  const { error: campaignError } = await supabase.from('campaigns').upsert(campaigns)
  if (campaignError) console.error('Campaign error:', campaignError)

  console.log('Done!')
}

seed()