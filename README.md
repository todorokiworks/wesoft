## start project
### install the nodejs and npm tools

``` shell
# how run in dev env

cd front-end

npm install

npm start


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
