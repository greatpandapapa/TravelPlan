# Travel Plan

## 概要

旅行計画を作成するWebアプリです。
旅行計画を立てる歳、情報収集、行きたい所、食べたいところを調べ、スケジュールを組んでいきますが、その作業をサポートするアプリです。

## License

- MIT Licenseで配布しています

## 公開

- https://github.com/gratepandapapa/TravelPlan

## 特徴

- 目的地（行きたい所、食べたいところなど）を登録して管理できます。
  - 予め目的地の候補を登録して、旅行のイメージを膨らませます
  - 参考URLや予約URLを登録できるので、
- 行きたい先を時間に沿って並べて、予定を作成できます。
　- 開始時間、所要時間、次の開始時間を自動的に計算します
  - 後の予定から逆算して前の時間を計算できます
- 予定と目的地の情報を合わせて工程表を作成できます。
  - Yahoo経路検索やGoogleマップの経路検索のURLを自動生成し、移動時間の計算できます
  - 目的地の定期日を登録することで、予定がお休みにバッティングしている場合にアラートを表示します
- どこにでも設置
  - Frontendアプリ単独でも動作します
  - サーバはPerl CGIスクリプトが動作すれば設置可能です
  - PHP版のサーバアプリも用意しています

## 構成
### Frontend
- TypeScript + React + Material UI
- JSONのデータファイルの読み込み、出力に対応しておりサーバなしでも利用可能
- サーバを設置するこで、サーバ側にファイルを置くことができる

### Backend
- JSONの読み込み、書き込み、ファイルリスト取得、削除のみ提供する。
  - 以下のJSONメッセージを受取り、処理を行う
  - load: JSONデータをサーバから読み込む
    ```
    {"controller":"Store","action":"load","name":name}
    ```
  - save：JSONデータをサーバに保存する
    ```
    {"controller":"Store","action":"save","name":name,"data:":data}
    ```
  - list：サーバに保存されているJSONデータの一覧を取得する
    ```
    {"controller":"Store","action":"list"}
    ```
  - delete：サーバに保存されているJSONデータを削除する
    ```
    {"controller":"Store","action":"delete","name":name}
    ```
- PHP版とCGI版のサーバがある。
- PHP Server
  - rewriteなどが不要でPHPが稼働するサーバがあれば設置できる独自フレームワークを利用
  - PHPのビルドインWebサーバや、Synology NASで動作することを確認
- Perl CGI
  - PerlとCGIスクリプトが動作すれば、設置できる
  - CGIモジュール、JSONモジュール、Fhモジュールを利用
  - BIGLOBEで動作することを確認

## 開発環境
- 開発で利用したバージョンは、以下の通り
  - Node.js
    - 20.15
  - PHP
    - 8.0
  - Perl
    - 5.6

## Setup
### FrontendのBuild
- .envをサーバに合わせて編集する必要がある。以下の２項目を設定する
  ```
  REACT_APP_SERVER_URL="サーバのURL"
  REACT_APP_BASEPATH='APPが配置されているパス'
  ```
- ローカルサーバ用（PHP Server）
  - .env.productionを編集
  - ビルド
  ```
  $ npm run build
  ```
- Public用（Perl CGI）
  - .env.production.publicを編集
  - ビルド
  ```
  $ npm run build:public
  ```
- buildをWebサーバに配置する

### Backend
#### PHP Serverのセットアップ
- Webサーバに配置する
- パッケージのインストール
  ```
  $ cd server
  $ composer update
  ```

#### Perl CGI Serverのセットアップ
- server_cgi以下をCGIスクリプトが有効なサーバに置く
- CPANから以下のモジュールをダウンロードしてextlib以下に配置する
  - CGI.pm 4.66
  - JSON.pm 4.10
