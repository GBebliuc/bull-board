import React from 'react'
import { AppJob } from '../../../@types/app'
import { Status } from '../constants'
import { Details } from './Details/Details'
import { JobActions } from './JobActions/JobActions'
import s from './JobCard.module.css'
import { Progress } from './Progress/Progress'

interface JobCardProps {
  job: AppJob
  status: Status
  actions: {
    promoteJob: () => Promise<void>
    retryJob: () => Promise<void>
    cleanJob: () => Promise<void>
  }
}

export const JobCard = ({ job, status, actions }: JobCardProps) => (
  <div className={s.card}>
    <div className={s.sideInfo}>
      <span title={`#${job.id}`}>#{job.id}</span>
      {/*<Timeline job={job} status={status} />*/}
    </div>
    <div className={s.contentWrapper}>
      <div className={s.title}>
        <h4>
          {job.name}
          {job.attempts > 0 && <span>attempt #{job.attempts + 1}</span>}
        </h4>
        <JobActions status={status} actions={actions} />
      </div>
      <div className={s.content}>
        <Details status={status} job={job} />
        {typeof job.progress === 'number' && (
          <Progress
            percentage={job.progress}
            status={status}
            className={s.progress}
          />
        )}
      </div>
    </div>
  </div>
)
