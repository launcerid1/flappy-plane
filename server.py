import http.server
import socketserver
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🛫 Flappy Plane server berjalan di http://localhost:{PORT}")
        print("Tekan Ctrl+C untuk berhenti.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✈️  Server dihentikan.")
