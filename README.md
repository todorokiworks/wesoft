## start project
### install the nodejs and npm tools

``` shell
# how run in dev env

cd front-end

npm install

# ルート（/）で動かす。npm start のみ。http://localhost:3000/

npm start

# GitHub Pages と同じベースパスで確認（/wesoft、fetch・画像・ルーティング一致）

npm run start:ghpages
# ブラウザは http://localhost:3000/wesoft/ を開く（トップは末尾スラッシュ付きが無難）
```


# how to build the web site
npm run build

# how edit the homepage show data 
cd front-end/data/
# edit the xx.json file to edit the web
```

## ビルド・デプロイ

### テスト環境（GitHub Pages）
- `main` ブランチへの push で自動デプロイ
- URL: https://todorokiworks.github.io/wesoft/

### 本番環境（納品用）
ルートパスで動作する形でビルドする場合：

``` shell
cd front-end
npm run build:production
```

`build/` フォルダをクライアントのサーバーにデプロイしてください。

# wesoft
