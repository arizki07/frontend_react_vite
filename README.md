<h1 class="text-center">✨ React Dashboard with Shadcn UI & Vite ✨</h1>

<h2>📜 Deskripsi Proyek</h2>
<p>Proyek ini adalah sebuah aplikasi <strong>frontend dashboard</strong> yang dibangun dengan <strong>React</strong>, <strong>Vite</strong>, dan <strong>TypeScript</strong>. Antarmuka pengguna (UI) dibuat menggunakan <strong>Shadcn UI</strong>, yang menawarkan komponen modern, mudah diakses, dan sangat dapat disesuaikan. Proyek ini berinteraksi dengan API backend dan dilengkapi dengan fungsionalitas seperti otentikasi, manajemen pengguna, audit logs, dan visualisasi data.</p>

<hr>

<h2>⚙️ Struktur Proyek</h2>
<p>Proyek ini mengikuti struktur yang modular dan terorganisir untuk memastikan skalabilitas dan pemeliharaan yang baik. Setiap folder memiliki tujuan yang jelas:</p>
<ul>
    <li><code>src/api</code>: Berisi file servis API seperti <code>AuditApi.ts</code> dan <code>UserApi.ts</code> untuk mengelola dan memusatkan semua panggilan HTTP ke backend.</li>
    <li><code>src/auth</code>: Menangani logika autentikasi, termasuk <strong>middleware</strong> <code>protectedRoute.tsx</code> yang berfungsi untuk melindungi rute-rute yang memerlukan otorisasi.</li>
    <li><code>src/components</code>: Kumpulan komponen UI yang dapat digunakan kembali, termasuk sub-folder <code>ui</code> yang secara khusus menampung komponen-komponen dari <strong>Shadcn UI</strong>.</li>
    <li><code>src/hooks</code>: Berisi <em>custom hooks</em> yang berisi logika bisnis yang dapat digunakan kembali di seluruh aplikasi.</li>
    <li><code>src/layouts</code>: Mendefinisikan struktur tata letak halaman yang berbeda, seperti <code>DashboardLayouts.tsx</code>, <code>UserLayouts.tsx</code>, dan <code>AuditLogsLayouts.tsx</code> untuk halaman audit logs.</li>
    <li><code>src/pages</code>: Direktori utama untuk halaman-halaman aplikasi, seperti <code>dashboard.tsx</code>, <code>login.tsx</code>, <code>profile.tsx</code>, dan <code>audit.tsx</code> untuk melihat daftar audit logs.</li>
</ul>

<hr>

<h2>💻 Teknologi yang Digunakan</h2>
<ul>
    <li><strong>Frontend</strong>: React, TypeScript, Vite, <strong>Shadcn UI</strong>, Tailwind CSS, Axios</li>
    <li><strong>Manajemen Paket</strong>: npm atau yarn</li>
    <li><strong>Linter</strong>: ESLint</li>
</ul>

<hr>

<h2>✨ Fitur Unggulan</h2>
<ul>
    <li><strong>UI Modern dengan Shadcn UI</strong>: Seluruh dashboard dan formulir login dibangun menggunakan <strong>Shadcn UI</strong>, yang dikenal dengan komponennya yang dapat disesuaikan dan diakses dengan mudah, memberikan tampilan yang bersih dan profesional.</li>
    <li><strong>Integrasi API</strong>: Aplikasi menggunakan <code>Axios</code> untuk berkomunikasi dengan API backend, dengan kode yang terstruktur rapi di dalam folder <code>src/api</code>.</li>
    <li><strong>Audit Logs</strong>: Tersedia halaman <code>AuditLogsLayouts.tsx</code> untuk melihat histori perubahan data. Fitur ini mendukung:
        <ul>
            <li>Pagination, filter, dan sorting</li>
            <li>Expandable detail <code>before</code> dan <code>after</code> dalam format JSON rapi</li>
            <li>Integrasi langsung dengan <code>AuditApi.ts</code></li>
        </ul>
    </li>
    <li><strong>Sistem Rute Terlindungi</strong>: Dengan adanya <strong>middleware</strong> <code>protectedRoute.tsx</code>, aplikasi dapat memastikan bahwa hanya pengguna yang sudah terautentikasi yang dapat mengakses halaman-halaman tertentu.</li>
    <li><strong>Struktur Proyek Modular</strong>: Desain yang terpisah antara komponen, halaman, dan layanan API membuat proyek ini mudah dikelola dan diperluas di masa mendatang.</li>
</ul>

<hr>

<h2>🚀 Panduan Menjalankan Proyek</h2>
<p>Ikuti langkah-langkah di bawah ini untuk memulai pengembangan secara lokal:</p>
<ol>
    <li><strong>Clone repositori:</strong>
        <pre><code>git clone https://github.com/arizki07/frontend_react_vite.git</code></pre>
    </li>
    <li><strong>Masuk ke direktori frontend:</strong>
        <pre><code>cd frontend</code></pre>
    </li>
    <li><strong>Instal semua dependensi:</strong>
        <pre><code>npm install</code></pre>
        <p>Atau jika Anda lebih suka menggunakan Yarn:</p>
        <pre><code>yarn install</code></pre>
    </li>
    <li><strong>Jalankan server development:</strong>
        <pre><code>npm run dev</code></pre>
        <p>Atau:</p>
        <pre><code>yarn dev</code></pre>
    </li>
</ol>
<p>Aplikasi akan otomatis terbuka di browser Anda pada <code>http://localhost:5173</code>.</p>

<hr>

<h2>📝 Catatan Tambahan</h2>
<ul>
    <li>Pastikan backend API sudah berjalan sebelum menggunakan fitur-fitur seperti audit logs dan manajemen pengguna.</li>
    <li>Halaman <code>AuditLogsLayouts</code> sudah terintegrasi dengan <code>AuditApi.ts</code> untuk mengambil data secara realtime.</li>
    <li>Folder <code>src/api</code> adalah pusat semua panggilan API, sehingga memudahkan pengelolaan dan penggantian endpoint jika diperlukan.</li>
</ul>
