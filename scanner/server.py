"""
UBIORA - Servidor API Local para Demo en Vivo (FastAPI o HTTP Server)
Permite al usuario ingresar endpoints o repositorios reales en el navegador,
escanearlos con sockets TLS reales, y ver el CBOM generado instantaneamente.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from engine import run_real_discovery, generate_cyclonedx_cbom

class UbioraApiHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/scan':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode('utf-8'))
                targets = data.get('targets', [])
                if isinstance(targets, str):
                    targets = [t.strip() for t in targets.splitlines() if t.strip()]
                
                discovered = run_real_discovery(targets)
                cbom = generate_cyclonedx_cbom(discovered, org_name=data.get('org', 'Demo Cliente'))
                
                response_payload = {
                    'status': 'success',
                    'count': len(discovered),
                    'assets': discovered,
                    'cbom': cbom
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_payload, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                import traceback
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e), 'trace': traceback.format_exc()}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'online', 'engine': 'UBIORA Python Engine v1.0'}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, UbioraApiHandler)
    print(f"[*] Servidor de descubrimiento UBIORA activo en http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Deteniendo servidor...")
        httpd.server_close()

if __name__ == '__main__':
    run_server(8080)
