import { MCP } from '@modelcontextprotocol/sdk';
import http from 'http';
import axios from 'axios';
const port = process.env.PORT || 3000;
// 名言APIのエンドポイント
const MEIGEN_API_URL = 'https://meigen.doodlenote.net/api/json.php';
// MCPの初期化
const mcp = new MCP({
    name: 'meigen-mcp',
    version: '1.0.0',
    description: '名言を取得するMCPサーバー',
});
// 名言を取得する関数
async function getMeigen() {
    try {
        const response = await axios.get(MEIGEN_API_URL);
        return response.data;
    }
    catch (error) {
        console.error('名言の取得に失敗しました:', error);
        throw error;
    }
}
// MCPのエンドポイントを設定
mcp.addEndpoint({
    name: 'get-meigen',
    description: '名言を取得します',
    handler: async () => {
        const meigen = await getMeigen();
        return {
            success: true,
            data: meigen,
        };
    },
});
// HTTPサーバーの作成
const server = http.createServer(async (req, res) => {
    if (req.url === '/get-meigen' && req.method === 'GET') {
        try {
            const meigen = await getMeigen();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: meigen,
            }));
        }
        catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: '名言の取得に失敗しました',
            }));
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: 'Not Found',
        }));
    }
});
// サーバーの起動
server.listen(port, () => {
    console.log(`MCPサーバーがポート ${port} で起動しました`);
});
