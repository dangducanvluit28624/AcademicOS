import { useState, type FormEvent } from 'react'
import type { StudentProfile } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { UserCircle, Save } from 'lucide-react'

export interface ProfileViewProps {
  profiles: StudentProfile[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

export function ProfileView({
  profiles,
  academicService,
  onReload,
}: ProfileViewProps) {
  const existingProfile = profiles[0] || {
    id: 'student-profile',
    name: '',
    overallGpa: undefined,
  }
  const [profile, setProfile] = useState<StudentProfile>(existingProfile)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveProfile(profile)
      await onReload()
      setMessage('Profile saved successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save profile',
      )
      setIsSuccess(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card
        title="Student Profile"
        subtitle="Manage your authoritative personal identifier and official cumulative GPA reported by your institution"
        icon={<UserCircle className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {profile.name || 'Anonymous Student'}
              </p>
              <p className="text-xs text-slate-500">
                {profile.overallGpa !== undefined
                  ? `Official GPA: ${profile.overallGpa.toFixed(2)}`
                  : 'Official GPA not set'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Student Name"
              aria-label="Student name"
              placeholder="e.g. Jane Doe"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
              helperText="Full name as recognized by your degree program"
            />

            <Input
              label="Official Cumulative GPA"
              aria-label="Overall GPA"
              type="number"
              min="0"
              max="4"
              step="0.01"
              placeholder="e.g. 3.85"
              value={profile.overallGpa ?? ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  overallGpa: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              helperText="Official university-certified 4.0 scale GPA (optional)"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              variant="primary"
              icon={<Save className="w-4 h-4" />}
            >
              Save profile
            </Button>
            {message && (
              <span
                role="status"
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message}
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
