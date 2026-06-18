# ADR 0001: Dependency Version Freeze

日期：2026-06-18

状态：采用

背景：方案要求 Node.js、pnpm、NestJS、Prisma、React、Next.js、Ant Design、微信小程序基础库、MySQL、Redis、BullMQ 等主版本固定，避免多端 monorepo 在开发、CI 和后续交付中发生依赖漂移。

决策：
- Node.js 固定为 `25.8.1`。
- pnpm 固定为 `10.12.1`。
- npm 依赖在 `dependencies` 与 `devDependencies` 中使用精确版本，不使用 `^` 或 `~` 范围。
- `peerDependencies` 只表达库兼容范围，不作为安装版本冻结来源。
- MySQL 使用 `mysql:8.4`，Redis 使用 `redis:7.4`。
- Prisma 暂固定在 `6.19.0`，以保留 `schema.prisma` + `DATABASE_URL` 的稳定迁移工作流。

影响范围：全部 apps、packages、本地开发环境和 GitHub Actions。

风险：精确版本会减少自动补丁更新，需要后续通过独立依赖维护任务评估升级。

回滚方案：回滚本 ADR、`package.json` 版本声明和 `pnpm-lock.yaml`。

关联 P0：P0-57。

关联任务：M0-02。
