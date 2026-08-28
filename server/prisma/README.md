# Fluxa Database Models

## Overview

Fluxa is a project management tool organized around a **workspace → team → project → task** hierarchy.

```
User
 └─ Workspace          (owned by / members of a workspace)
     ├─ WorkspaceMember      (who belongs, with a role)
     ├─ WorkspaceInvitation  (pending invites)
     ├─ Team                 (groups members + owns projects)
     │   └─ TeamMember       (who is in the team, with a role)
     ├─ Project              (belongs to a workspace, optionally to a team)
     │   ├─ Board → Column
     │   ├─ Sprint
     │   ├─ Label
     │   └─ Task
     │       ├─ TaskAssignee
     │       ├─ TaskLabel
     │       ├─ TaskComment
     │       ├─ TaskActivity
     │       └─ Attachment
     └─ Notification
```

---

## Enums

| Enum               | Values                                                | Used by                                  |
| ------------------ | ----------------------------------------------------- | ---------------------------------------- |
| `MemberRole`       | `OWNER`, `ADMIN`, `MEMBER`                            | `WorkspaceMember`, `WorkspaceInvitation` |
| `TeamRole`         | `LEAD`, `MEMBER`                                      | `TeamMember`                             |
| `InvitationStatus` | `PENDING`, `ACCEPTED`, `REVOKED`, `EXPIRED`           | `WorkspaceInvitation`                    |
| `TaskStatus`       | `BACKLOG`, `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE` | `Task`, `Column`                         |
| `TaskType`         | `TASK`, `BUG`, `STORY`, `EPIC`                        | `Task`                                   |
| `Priority`         | `LOW`, `MEDIUM`, `HIGH`, `URGENT`                     | `Task`                                   |
| `SprintStatus`     | `PLANNED`, `ACTIVE`, `COMPLETED`                      | `Sprint`                                 |

---

## Users & Identity

### User

`user.schema.prisma` — maps to `users`

| Field             | Type       | Notes                             |
| ----------------- | ---------- | --------------------------------- |
| `id`              | `String`   | PK, UUID                          |
| `email`           | `String`   | Unique                            |
| `password`        | `String`   | Hashed, never returned by the API |
| `username`        | `String?`  | Unique                            |
| `title`           | `String?`  |                                   |
| `avatar`          | `String?`  |                                   |
| `profileComplete` | `Boolean`  | Default `false`                   |
| `createdAt`       | `DateTime` |                                   |
| `updatedAt`       | `DateTime` |                                   |

**Relationships:**

- `memberships` → `WorkspaceMember[]` (many-to-many with workspaces)
- `teamMemberships` → `TeamMember[]` (many-to-many with teams)
- `ownedWorkspaces` → `Workspace[]` (as owner)
- `invitationsSent` → `WorkspaceInvitation[]` (as inviter)
- `createdProjects` → `Project[]`
- `reportedTasks` / `taskAssignments` / `taskComments` / `taskActivities` → Task-related
- `uploads` → `Attachment[]`
- `notifications` → `Notification[]`

---

## Workspaces

### Workspace

`workspace.schema.prisma` — maps to `workspaces`

| Field       | Type       | Notes                  |
| ----------- | ---------- | ---------------------- |
| `id`        | `String`   | PK, UUID               |
| `name`      | `String`   |                        |
| `slug`      | `String`   | Unique, auto-generated |
| `color`     | `String`   | Default `#6366f1`      |
| `createdBy` | `String`   | FK → `User.id`         |
| `createdAt` | `DateTime` |                        |
| `updatedAt` | `DateTime` |                        |

**Constraints:** unique on `(createdBy, name)`.
**Relationships:** `members`, `invitations`, `teams`, `projects`. Deleting a workspace cascades to members, invitations, teams, and projects.

### WorkspaceMember

`workspace.schema.prisma` — maps to `workspace_members`

| Field         | Type         | Notes               |
| ------------- | ------------ | ------------------- |
| `id`          | `String`     | PK, UUID            |
| `workspaceId` | `String`     | FK → `Workspace.id` |
| `userId`      | `String`     | FK → `User.id`      |
| `role`        | `MemberRole` | Default `MEMBER`    |
| `createdAt`   | `DateTime`   |                     |

**Constraints:** unique on `(workspaceId, userId)` — a user belongs to a workspace once.

### WorkspaceInvitation

`workspace.schema.prisma` — maps to `workspace_invitations`

| Field         | Type               | Notes                            |
| ------------- | ------------------ | -------------------------------- |
| `id`          | `String`           | PK, UUID                         |
| `workspaceId` | `String`           | FK → `Workspace.id`              |
| `email`       | `String`           |                                  |
| `token`       | `String`           | Unique, used for the invite link |
| `role`        | `MemberRole`       | Default `MEMBER`                 |
| `status`      | `InvitationStatus` | Default `PENDING`                |
| `expiresAt`   | `DateTime?`        |                                  |
| `invitedById` | `String`           | FK → `User.id` (the inviter)     |
| `createdAt`   | `DateTime`         |                                  |
| `updatedAt`   | `DateTime`         |                                  |

**Constraints:** unique on `(workspaceId, email)`.

---

## Teams

### Team

`project.schema.prisma` — maps to `teams`

| Field         | Type       | Notes               |
| ------------- | ---------- | ------------------- |
| `id`          | `String`   | PK, UUID            |
| `name`        | `String`   |                     |
| `description` | `String?`  |                     |
| `workspaceId` | `String`   | FK → `Workspace.id` |
| `createdAt`   | `DateTime` |                     |
| `updatedAt`   | `DateTime` |                     |

**Index:** `workspaceId`.
**Relationships:** `members`, `projects`. Teams group members and own projects.

### TeamMember

`project.schema.prisma` — maps to `team_members`

| Field       | Type       | Notes            |
| ----------- | ---------- | ---------------- |
| `id`        | `String`   | PK, UUID         |
| `teamId`    | `String`   | FK → `Team.id`   |
| `userId`    | `String`   | FK → `User.id`   |
| `role`      | `TeamRole` | Default `MEMBER` |
| `createdAt` | `DateTime` |                  |

**Constraints:** unique on `(teamId, userId)`. Deleting a team cascades to its members.

---

## Projects

### Project

`project.schema.prisma` — maps to `projects`

| Field         | Type       | Notes                       |
| ------------- | ---------- | --------------------------- |
| `id`          | `String`   | PK, UUID                    |
| `name`        | `String`   |                             |
| `key`         | `String`   | Unique within the workspace |
| `description` | `String?`  |                             |
| `workspaceId` | `String`   | FK → `Workspace.id`         |
| `teamId`      | `String?`  | FK → `Team.id` (optional)   |
| `createdBy`   | `String`   | FK → `User.id`              |
| `createdAt`   | `DateTime` |                             |
| `updatedAt`   | `DateTime` |                             |

**Constraints:** unique on `(workspaceId, key)`.
**Relationships:** `boards`, `sprints`, `labels`, `tasks`. Deleting a project cascades to boards, sprints, labels, and tasks.

### Board & Column

`project.schema.prisma` — maps to `boards` / `columns`

**Board** — PK `id`, `name` (default `"Board"`), FK `projectId`. One board per project; deleting a project cascades.

**Column** — PK `id`, `name`, `status` (`TaskStatus`), `position`, optional `color` and `wipLimit`, FK `boardId`. Unique on `(boardId, position)`. Deleting a board cascades.

### Sprint

`project.schema.prisma` — maps to `sprints`

| Field       | Type           | Notes             |
| ----------- | -------------- | ----------------- |
| `id`        | `String`       | PK, UUID          |
| `name`      | `String`       |                   |
| `goal`      | `String?`      |                   |
| `projectId` | `String`       | FK → `Project.id` |
| `status`    | `SprintStatus` | Default `PLANNED` |
| `startDate` | `DateTime?`    |                   |
| `endDate`   | `DateTime?`    |                   |
| `createdAt` | `DateTime`     |                   |
| `updatedAt` | `DateTime`     |                   |

**Index:** `(projectId, status)`.

### Label

`project.schema.prisma` — maps to `labels`

| Field       | Type       | Notes             |
| ----------- | ---------- | ----------------- |
| `id`        | `String`   | PK, UUID          |
| `name`      | `String`   |                   |
| `color`     | `String?`  |                   |
| `projectId` | `String`   | FK → `Project.id` |
| `createdAt` | `DateTime` |                   |

**Constraints:** unique on `(projectId, name)`. Linked to tasks via `TaskLabel`.

---

## Tasks

### Task

`task.schema.prisma` — maps to `tasks`

| Field         | Type         | Notes                         |
| ------------- | ------------ | ----------------------------- |
| `id`          | `String`     | PK, UUID                      |
| `title`       | `String`     |                               |
| `description` | `String?`    |                               |
| `projectId`   | `String`     | FK → `Project.id`             |
| `columnId`    | `String`     | FK → `Column.id`              |
| `sprintId`    | `String?`    | FK → `Sprint.id` (optional)   |
| `reporterId`  | `String`     | FK → `User.id` (the reporter) |
| `type`        | `TaskType`   | Default `TASK`                |
| `priority`    | `Priority`   | Default `MEDIUM`              |
| `status`      | `TaskStatus` |                               |
| `position`    | `Int`        | Ordering within a column      |
| `estimate`    | `Int?`       |                               |
| `dueDate`     | `DateTime?`  |                               |
| `createdAt`   | `DateTime`   |                               |
| `updatedAt`   | `DateTime`   |                               |

**Indexes:** `(projectId, status, position)`, `(columnId, position)`, `sprintId`, `reporterId`.
**Relationships:** `assignees`, `labels`, `comments`, `activities`, `attachments`, `notifications`. Deleting a project cascades.

### TaskAssignee

`task.schema.prisma` — maps to `task_assignees`

PK `id`, FK `taskId`, FK `userId`, `assignedAt`. **Unique on `(taskId, userId)`** — a user is assigned to a task once.

### TaskLabel

`task.schema.prisma` — maps to `task_labels`

PK `id`, FK `taskId`, FK `labelId`. **Unique on `(taskId, labelId)`** — join table between tasks and labels.

### TaskComment

`task.schema.prisma` — maps to `task_comments`

PK `id`, `body`, FK `taskId`, FK `authorId`, `createdAt`, `updatedAt`. Deleting a task cascades.

### TaskActivity

`task.schema.prisma` — maps to `task_activities`

PK `id`, FK `taskId`, FK `actorId`, `changes` (`Json`), `createdAt`. Index on `(taskId, createdAt)` — an audit trail of who changed what.

---

## Attachments & Notifications

### Attachment

`attachment.schema.prisma` — maps to `attachments`

| Field        | Type       | Notes                       |
| ------------ | ---------- | --------------------------- |
| `id`         | `String`   | PK, UUID                    |
| `taskId`     | `String`   | FK → `Task.id`              |
| `uploaderId` | `String`   | FK → `User.id`              |
| `fileName`   | `String`   |                             |
| `mimeType`   | `String?`  |                             |
| `size`       | `Int`      |                             |
| `key`        | `String`   | Unique (object storage key) |
| `url`        | `String?`  |                             |
| `createdAt`  | `DateTime` |                             |

### Notification

`notification.schema.prisma` — maps to `notifications`

| Field       | Type        | Notes                      |
| ----------- | ----------- | -------------------------- |
| `id`        | `String`    | PK, UUID                   |
| `userId`    | `String`    | FK → `User.id` (recipient) |
| `type`      | `String`    |                            |
| `title`     | `String`    |                            |
| `body`      | `String?`   |                            |
| `taskId`    | `String?`   | FK → `Task.id` (optional)  |
| `readAt`    | `DateTime?` | Null until read            |
| `createdAt` | `DateTime`  |                            |

**Index:** `(userId, readAt)`.

---

## Conventions

- All primary keys are UUID strings (`String @id @default(uuid())`).
- Timestamps use `@default(now())` / `@updatedAt`.
- `onDelete: Cascade` joins (`WorkspaceMember`, `TeamMember`, `TaskAssignee`, `TaskLabel`, `TaskComment`, `TaskActivity`, `Attachment`) are deleted when their parent is.
- Composite uniques encode "may exist once" rules: `(workspaceId, userId)`, `(teamId, userId)`, `(workspaceId, email)`, `(taskId, userId)`, `(taskId, labelId)`.
- Schema files are split by domain (`user`, `workspace`, `project`, `task`, `attachment`, `notification`) and merged by the root `prisma/schema.prisma`.
