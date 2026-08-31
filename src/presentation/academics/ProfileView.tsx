import { useState, type FormEvent } from 'react'
import type { StudentProfile } from '../../domain'
import type { AcademicService } from '../../application'

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

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveProfile(profile)
      await onReload()
      setMessage('Profile saved successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save profile',
      )
    }
  }

  return (
    <div>
      <h3>Student Profile</h3>
      <form onSubmit={(e) => void handleSave(e)}>
        <div style={{ marginBottom: '8px' }}>
          <label>
            Name:
            <input
              style={{ marginLeft: '8px' }}
              aria-label="Student name"
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>
            Overall GPA:
            <input
              style={{ marginLeft: '8px' }}
              aria-label="Overall GPA"
              type="number"
              min="0"
              max="4"
              step="0.01"
              placeholder="Overall GPA"
              value={profile.overallGpa ?? ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  overallGpa: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </label>
        </div>
        <button type="submit">Save profile</button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>
    </div>
  )
}
