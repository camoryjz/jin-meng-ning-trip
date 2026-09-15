# Cloudflare Pages 部署说明

此包已按当前项目配置好：
- Pages 项目：jin-meng-ning-trip
- 静态目录：public
- D1 binding：DB
- D1 database：jin-meng-ning-trip-db
- 共享集合：todos、tickets、ledger

首次切换到完整共享版时，先执行：

```bash
npx wrangler@latest d1 execute jin-meng-ning-trip-db --remote --file=./cloudflare-d1/0001_shared_trip_data.sql
npx wrangler@latest pages deploy public --project-name jin-meng-ning-trip
```

验证：

```bash
curl 'https://jin-meng-ning-trip.pages.dev/api/trip/jin-meng-ning-roadtrip-20260924?collections=todos,tickets'
```

GET 读取接口公开可访问；写入接口需要 Cloudflare Secret EDIT_PIN 验证。不要把证件号、完整订单号、二维码、支付信息等敏感内容写入共享数据。
