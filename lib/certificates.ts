export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    credentialUrl?: string; // Link to verify credential (e.g., Credly, Coursera)
    credentialId?: string; // The ID of the certificate
    image?: string; // Path to the certificate image (thumbnail/cover) e.g., /certificates/aws-cover.png
    fileUrl?: string; // Path to the actual certificate file (e.g., PDF or high-res image) like /certificates/mtcna.pdf
    tags: string[];
}

export const CERTIFICATES: Certificate[] = [
    {
        id: "cert-wowskill-2026",
        title: "1st Winner Cyber Security",
        issuer: "WOWSKILL",
        date: "2026",
        description: "Meraih Juara 1 (First Winner) dalam kompetisi Cyber Security yang diselenggarakan oleh WOWSKILL. Menjadi salah satu pencapaian terbesar dalam bidang keamanan siber dan penetration testing di tahun 2026.",
        image: "/certificates/FOTO-JUARA-1-WOW-2026.jpeg",
        fileUrl: "/certificates/FOTO-JUARA-1-WOW-2026.jpeg",
        tags: ["Cyber Security", "1st Place", "Champion"],
    },
    {
        id: "cert-aractf-2026",
        title: "Finalis CTF ARA 7.0",
        issuer: "HMIT ITS Surabaya",
        date: "Februari 2026",
        description: "Mencapai babak Final sebagai Finalis dalam ajang kejuaraan nasional Capture The Flag - A Renewal Agent (ARA) 7.0 yang diadakan oleh Himpunan Mahasiswa Teknologi Informasi (HMIT) Institut Teknologi Sepuluh Nopember (ITS).",
        credentialId: "447/SER/ARA/RISTEK/HMIT-ITS/II/2026",
        image: "/certificates/FinalsAraCTF7.0.png",
        fileUrl: "/certificates/FinalsAraCTF7.0.png",
        tags: ["Cyber Security", "CTF", "ITS"],
    },
    {
        id: "cert-jcc-2025",
        title: "Finalis Jatim Cybersecurity Competition",
        issuer: "Kominfo Jawa Timur",
        date: "2025",
        description: "Berhasil meraih posisi Finalis dalam Jatim Cybersecurity Competition (JCC) 2025, kejuaraan bergengsi tingkat provinsi yang diselenggarakan oleh Dinas Komunikasi dan Informatika Provinsi Jawa Timur.",
        credentialId: "000.6.4.1/1126.75/114.5/2025",
        fileUrl: "/certificates/JCC-2025.pdf",
        tags: ["Cyber Security", "CTF", "BSSN"],
    },
    {
        id: "cert-fitcom-2025",
        title: "Finalis Cyber Security FITCOM 3.0",
        issuer: "Universitas Dinamika",
        date: "Oktober 2025",
        description: "Menjadi Finalis dalam ajang kompetisi Cyber Security tingkat Jawa Timur (Faculty of Informatics Technology Competition - FITCOM 3.0) yang diselenggarakan oleh Universitas Dinamika kolaborasi bersama Kominfo Jatim.",
        credentialId: "360/FTI/FITCOM/SL/X/2025",
        image: "/certificates/FITCOM-3.0.png",
        fileUrl: "/certificates/FITCOM-3.0.png",
        tags: ["Cyber Security", "CTF", "Competition"],
    },
    {
        id: "cert-jhic-2025",
        title: "Quarter Finalist JHIC 2025",
        issuer: "Jagoan Hosting",
        date: "November 2025",
        description: "Lolos memembus Quarter Finalist dalam ajang Jagoan Hosting Infra Competition (JHIC) 2025, ajang uji kompetensi bergengsi di bidang infrastruktur teknologi terapan berskala nasional.",
        image: "/certificates/JHIC.png",
        fileUrl: "/certificates/JHIC.png",
        tags: ["Infrastructure", "DevOps", "Jagoan Hosting"],
    },
    {
        id: "cert-digiup-2025",
        title: "Cyber Security Officer",
        issuer: "Telkom DigiUp",
        date: "Desember 2025",
        description: "Menyelesaikan program sertifikasi Cyber Security Officer dari Telkom DigiUp & TPCC. Mempelajari fundamental security, kontrol akses (DAC/MAC/RBAC), Security Assessment, hingga pengujian Nmap, SQLMap, Wireshark, dan firewall Snort.",
        credentialId: "D2500858",
        fileUrl: "/certificates/Digiup-Cybersecurity-2025.pdf",
        tags: ["Cyber Security", "Penetration Testing", "Telkom"],
    },
];
