/**
 * Çeşitli oyuncu sayıları (5, 6, 7, 8, 9, 10, 11) için hazır diziliş şablonları.
 * Her oyuncu için hem 'attack' (Topa Sahipken) hem 'defense' (Top Rakipteyken) koordinatları,
 * rolleri ve görevleri ayrı ayrı tanımlıdır.
 * Koordinat sistemi: x: 0 (sol) -> 100 (sağ), y: 0 (rakip kale/üst) -> 100 (kendi kalemiz/alt).
 */

export const PRESETS = {
  11: [
    {
      id: '11-4231',
      name: '4-2-3-1 Kontrol (Atak) / 4-4-2 (Karşılama)',
      description: 'Topa sahipken 3-2-4-1 şekline dönen modern sistem; top rakipteyken 4-4-2 orta blok.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'sk', duty: 'defend' } },
        { num: 2, name: 'Sağ Bek', atk: { x: 76, y: 66, role: 'iwb', duty: 'support' }, def: { x: 84, y: 74, role: 'fb', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 64, y: 76, role: 'bpd', duty: 'defend' }, def: { x: 62, y: 77, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Stoper', atk: { x: 38, y: 76, role: 'cd', duty: 'defend' }, def: { x: 38, y: 77, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Bek', atk: { x: 18, y: 52, role: 'wb', duty: 'attack' }, def: { x: 16, y: 74, role: 'fb', duty: 'defend' } },
        { num: 6, name: 'Ön Libero', atk: { x: 42, y: 60, role: 'dlp', duty: 'defend' }, def: { x: 40, y: 55, role: 'dm', duty: 'defend' } },
        { num: 8, name: 'Merkez Orta Saha', atk: { x: 62, y: 50, role: 'b2b', duty: 'support' }, def: { x: 60, y: 55, role: 'cm', duty: 'support' } },
        { num: 7, name: 'Sağ Kanat', atk: { x: 84, y: 28, role: 'w', duty: 'attack' }, def: { x: 82, y: 50, role: 'w', duty: 'support' } },
        { num: 10, name: 'On Numara', atk: { x: 52, y: 30, role: 'ap', duty: 'attack' }, def: { x: 58, y: 28, role: 'am', duty: 'support' } },
        { num: 11, name: 'Sol Kanat', atk: { x: 32, y: 26, role: 'if', duty: 'attack' }, def: { x: 18, y: 50, role: 'iw', duty: 'support' } },
        { num: 9, name: 'Santrafor', atk: { x: 50, y: 14, role: 'af', duty: 'attack' }, def: { x: 42, y: 24, role: 'pf', duty: 'support' } }
      ]
    },
    {
      id: '11-433',
      name: '4-3-3 Yüksek Baskı',
      description: 'Atakta 2-3-5 kanat genişliği, karşılamada 4-1-4-1 kompakt savunma.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'sk', duty: 'defend' } },
        { num: 2, name: 'Sağ Bek', atk: { x: 84, y: 54, role: 'wb', duty: 'attack' }, def: { x: 84, y: 75, role: 'fb', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 63, y: 76, role: 'bpd', duty: 'defend' }, def: { x: 62, y: 78, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Stoper', atk: { x: 37, y: 76, role: 'cd', duty: 'defend' }, def: { x: 38, y: 78, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Bek', atk: { x: 16, y: 56, role: 'wb', duty: 'support' }, def: { x: 16, y: 75, role: 'fb', duty: 'defend' } },
        { num: 6, name: 'Çapa', atk: { x: 50, y: 61, role: 'anchor', duty: 'defend' }, def: { x: 50, y: 63, role: 'anchor', duty: 'defend' } },
        { num: 8, name: 'Sağ İç', atk: { x: 66, y: 39, role: 'mez', duty: 'attack' }, def: { x: 62, y: 48, role: 'cm', duty: 'support' } },
        { num: 10, name: 'Sol İç', atk: { x: 34, y: 41, role: 'dlp', duty: 'support' }, def: { x: 38, y: 48, role: 'bwm', duty: 'support' } },
        { num: 7, name: 'Sağ Açık', atk: { x: 76, y: 22, role: 'if', duty: 'attack' }, def: { x: 82, y: 44, role: 'iw', duty: 'support' } },
        { num: 11, name: 'Sol Açık', atk: { x: 20, y: 22, role: 'w', duty: 'attack' }, def: { x: 18, y: 44, role: 'w', duty: 'support' } },
        { num: 9, name: 'Santrafor', atk: { x: 50, y: 14, role: 'dlf', duty: 'support' }, def: { x: 50, y: 22, role: 'pf', duty: 'defend' } }
      ]
    },
    {
      id: '11-352',
      name: '3-5-2 / 5-3-2 Geçiş',
      description: 'Topa sahipken kanat beklerle 3-5-2, top rakipteyken 5-3-2 beşli savunma.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'gk', duty: 'defend' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 72, y: 74, role: 'wcb', duty: 'support' }, def: { x: 70, y: 77, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Merkez Stoper', atk: { x: 50, y: 77, role: 'bpd', duty: 'defend' }, def: { x: 50, y: 79, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Stoper', atk: { x: 28, y: 74, role: 'wcb', duty: 'defend' }, def: { x: 30, y: 77, role: 'cd', duty: 'defend' } },
        { num: 2, name: 'Sağ Kanat Bek', atk: { x: 88, y: 36, role: 'wb', duty: 'attack' }, def: { x: 88, y: 72, role: 'wb', duty: 'defend' } },
        { num: 11, name: 'Sol Kanat Bek', atk: { x: 12, y: 38, role: 'wb', duty: 'support' }, def: { x: 12, y: 72, role: 'wb', duty: 'defend' } },
        { num: 6, name: 'Ön Libero', atk: { x: 50, y: 58, role: 'dlp', duty: 'defend' }, def: { x: 50, y: 58, role: 'dm', duty: 'defend' } },
        { num: 8, name: 'Sağ Orta Saha', atk: { x: 64, y: 42, role: 'mez', duty: 'support' }, def: { x: 66, y: 52, role: 'cm', duty: 'support' } },
        { num: 10, name: 'Sol Orta Saha', atk: { x: 36, y: 42, role: 'b2b', duty: 'support' }, def: { x: 34, y: 52, role: 'bwm', duty: 'defend' } },
        { num: 9, name: 'Santrafor 1', atk: { x: 58, y: 15, role: 'af', duty: 'attack' }, def: { x: 58, y: 27, role: 'pf', duty: 'support' } },
        { num: 7, name: 'Santrafor 2', atk: { x: 40, y: 20, role: 'dlf', duty: 'support' }, def: { x: 42, y: 27, role: 'dlf', duty: 'support' } }
      ]
    }
  ],
  10: [
    {
      id: '10-4221',
      name: '4-2-2-1 (10 Kişi)',
      description: '10 oyunculu maçlar için dengeli 4-2-2-1 dizilişi.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 2, name: 'Sağ Bek', atk: { x: 84, y: 60, role: 'wb', duty: 'attack' }, def: { x: 84, y: 75, role: 'fb', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 63, y: 76, role: 'bpd', duty: 'defend' }, def: { x: 62, y: 77, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Stoper', atk: { x: 37, y: 76, role: 'cd', duty: 'defend' }, def: { x: 38, y: 77, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Bek', atk: { x: 16, y: 60, role: 'wb', duty: 'support' }, def: { x: 16, y: 75, role: 'fb', duty: 'defend' } },
        { num: 6, name: 'Ön Libero 1', atk: { x: 39, y: 55, role: 'dlp', duty: 'defend' }, def: { x: 39, y: 56, role: 'dm', duty: 'defend' } },
        { num: 8, name: 'Ön Libero 2', atk: { x: 61, y: 52, role: 'b2b', duty: 'support' }, def: { x: 61, y: 56, role: 'bwm', duty: 'support' } },
        { num: 7, name: 'Sağ Kanat', atk: { x: 74, y: 30, role: 'if', duty: 'attack' }, def: { x: 76, y: 40, role: 'iw', duty: 'support' } },
        { num: 11, name: 'Sol Kanat', atk: { x: 26, y: 30, role: 'iw', duty: 'support' }, def: { x: 24, y: 40, role: 'w', duty: 'support' } },
        { num: 9, name: 'Santrafor', atk: { x: 50, y: 15, role: 'cf', duty: 'attack' }, def: { x: 50, y: 24, role: 'pf', duty: 'support' } }
      ]
    }
  ],
  9: [
    {
      id: '9-332',
      name: '3-3-2 Dengeli (9v9)',
      description: '9v9 formatı için üçlü savunma ve çift forvetli esnek diziliş.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 76, y: 70, role: 'wcb', duty: 'support' }, def: { x: 74, y: 75, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Merkez Stoper', atk: { x: 50, y: 75, role: 'bpd', duty: 'defend' }, def: { x: 50, y: 77, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Stoper', atk: { x: 24, y: 70, role: 'wcb', duty: 'support' }, def: { x: 26, y: 75, role: 'cd', duty: 'defend' } },
        { num: 7, name: 'Sağ Orta Saha', atk: { x: 78, y: 42, role: 'w', duty: 'attack' }, def: { x: 78, y: 54, role: 'w', duty: 'support' } },
        { num: 6, name: 'Merkez Orta Saha', atk: { x: 50, y: 50, role: 'dlp', duty: 'support' }, def: { x: 50, y: 55, role: 'cm', duty: 'defend' } },
        { num: 11, name: 'Sol Orta Saha', atk: { x: 22, y: 42, role: 'iw', duty: 'support' }, def: { x: 22, y: 54, role: 'iw', duty: 'support' } },
        { num: 9, name: 'Sağ Forvet', atk: { x: 60, y: 17, role: 'af', duty: 'attack' }, def: { x: 60, y: 30, role: 'pf', duty: 'support' } },
        { num: 10, name: 'Sol Forvet', atk: { x: 40, y: 20, role: 'dlf', duty: 'support' }, def: { x: 40, y: 30, role: 'dlf', duty: 'support' } }
      ]
    }
  ],
  8: [
    {
      id: '8-331',
      name: '3-3-1 (8v8)',
      description: '8v8 futbolu için ideal savunma güvenliği ve kanat akışkanlığı.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 2, name: 'Sağ Savunma', atk: { x: 78, y: 66, role: 'fb', duty: 'support' }, def: { x: 76, y: 74, role: 'fb', duty: 'defend' } },
        { num: 5, name: 'Stoper', atk: { x: 50, y: 75, role: 'bpd', duty: 'defend' }, def: { x: 50, y: 76, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Savunma', atk: { x: 22, y: 66, role: 'fb', duty: 'support' }, def: { x: 24, y: 74, role: 'fb', duty: 'defend' } },
        { num: 7, name: 'Sağ Kanat', atk: { x: 78, y: 34, role: 'if', duty: 'attack' }, def: { x: 76, y: 50, role: 'w', duty: 'support' } },
        { num: 8, name: 'Merkez', atk: { x: 50, y: 46, role: 'b2b', duty: 'support' }, def: { x: 50, y: 52, role: 'cm', duty: 'defend' } },
        { num: 11, name: 'Sol Kanat', atk: { x: 22, y: 34, role: 'iw', duty: 'attack' }, def: { x: 24, y: 50, role: 'w', duty: 'support' } },
        { num: 9, name: 'Forvet', atk: { x: 50, y: 16, role: 'cf', duty: 'attack' }, def: { x: 50, y: 26, role: 'pf', duty: 'support' } }
      ]
    }
  ],
  7: [
    {
      id: '7-231',
      name: '2-3-1 Klasik (7v7 / Halı Saha)',
      description: '7v7 maçların vazgeçilmezi: Atakta kanatlar açılır, karşılamada 3-2-1 veya 2-3-1 blok.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sağ Stoper', atk: { x: 68, y: 72, role: 'bpd', duty: 'support' }, def: { x: 66, y: 75, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Stoper', atk: { x: 32, y: 72, role: 'cd', duty: 'defend' }, def: { x: 34, y: 75, role: 'cd', duty: 'defend' } },
        { num: 7, name: 'Sağ Kanat', atk: { x: 82, y: 40, role: 'w', duty: 'attack' }, def: { x: 78, y: 53, role: 'w', duty: 'support' } },
        { num: 8, name: 'Merkez Orta Saha', atk: { x: 50, y: 48, role: 'dlp', duty: 'support' }, def: { x: 50, y: 55, role: 'cm', duty: 'defend' } },
        { num: 11, name: 'Sol Kanat', atk: { x: 18, y: 40, role: 'if', duty: 'attack' }, def: { x: 22, y: 53, role: 'iw', duty: 'support' } },
        { num: 9, name: 'Forvet', atk: { x: 50, y: 16, role: 'af', duty: 'attack' }, def: { x: 50, y: 28, role: 'pf', duty: 'support' } }
      ]
    },
    {
      id: '7-321',
      name: '3-2-1 Sağlam Savunma (7v7)',
      description: 'Üçlü savunma önünde çift orta saha ile kontrollü 7v7 sistemi.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'gk', duty: 'defend' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 2, name: 'Sağ Bek', atk: { x: 80, y: 62, role: 'wb', duty: 'attack' }, def: { x: 76, y: 74, role: 'fb', duty: 'defend' } },
        { num: 4, name: 'Stoper', atk: { x: 50, y: 74, role: 'bpd', duty: 'defend' }, def: { x: 50, y: 76, role: 'cd', duty: 'defend' } },
        { num: 3, name: 'Sol Bek', atk: { x: 20, y: 62, role: 'wb', duty: 'attack' }, def: { x: 24, y: 74, role: 'fb', duty: 'defend' } },
        { num: 6, name: 'Orta Saha 1', atk: { x: 38, y: 44, role: 'b2b', duty: 'support' }, def: { x: 38, y: 52, role: 'cm', duty: 'defend' } },
        { num: 10, name: 'Orta Saha 2', atk: { x: 62, y: 40, role: 'ap', duty: 'attack' }, def: { x: 62, y: 52, role: 'cm', duty: 'support' } },
        { num: 9, name: 'Forvet', atk: { x: 50, y: 16, role: 'cf', duty: 'attack' }, def: { x: 50, y: 26, role: 'pf', duty: 'support' } }
      ]
    }
  ],
  6: [
    {
      id: '6-221',
      name: '2-2-1 Kutu (6v6)',
      description: '6v6 için merkezde kutu oluşturan pas odaklı diziliş.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sağ Savunma', atk: { x: 70, y: 70, role: 'bpd', duty: 'support' }, def: { x: 68, y: 74, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Savunma', atk: { x: 30, y: 70, role: 'cd', duty: 'defend' }, def: { x: 32, y: 74, role: 'cd', duty: 'defend' } },
        { num: 7, name: 'Sağ Orta Saha', atk: { x: 74, y: 40, role: 'mez', duty: 'attack' }, def: { x: 70, y: 50, role: 'cm', duty: 'support' } },
        { num: 8, name: 'Sol Orta Saha', atk: { x: 26, y: 40, role: 'b2b', duty: 'support' }, def: { x: 30, y: 50, role: 'cm', duty: 'defend' } },
        { num: 9, name: 'Forvet', atk: { x: 50, y: 17, role: 'dlf', duty: 'attack' }, def: { x: 50, y: 26, role: 'pf', duty: 'support' } }
      ]
    }
  ],
  5: [
    {
      id: '5-121',
      name: '1-2-1 Elmas (5v5 / Futsal)',
      description: '5v5 ve futsal için klasik elmas: 1 çapa, 2 kanat, 1 pivot.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sabit Savunma', atk: { x: 50, y: 70, role: 'bpd', duty: 'defend' }, def: { x: 50, y: 74, role: 'cd', duty: 'defend' } },
        { num: 7, name: 'Sağ Kanat', atk: { x: 78, y: 43, role: 'iw', duty: 'attack' }, def: { x: 74, y: 53, role: 'w', duty: 'support' } },
        { num: 11, name: 'Sol Kanat', atk: { x: 22, y: 43, role: 'iw', duty: 'support' }, def: { x: 26, y: 53, role: 'w', duty: 'support' } },
        { num: 9, name: 'Pivot', atk: { x: 50, y: 18, role: 'tf', duty: 'attack' }, def: { x: 50, y: 28, role: 'pf', duty: 'support' } }
      ]
    },
    {
      id: '5-22',
      name: '2-2 Kare (5v5)',
      description: 'İki savunma iki hücum oyuncusuyla basit ve etkili 5v5 dizilişi.',
      players: [
        { num: 1, name: 'Kaleci', atk: { x: 50, y: 92, role: 'sk', duty: 'support' }, def: { x: 50, y: 93, role: 'gk', duty: 'defend' } },
        { num: 4, name: 'Sağ Savunma', atk: { x: 68, y: 66, role: 'bpd', duty: 'support' }, def: { x: 68, y: 72, role: 'cd', duty: 'defend' } },
        { num: 5, name: 'Sol Savunma', atk: { x: 32, y: 66, role: 'bpd', duty: 'defend' }, def: { x: 32, y: 72, role: 'cd', duty: 'defend' } },
        { num: 7, name: 'Sağ Hücum', atk: { x: 68, y: 24, role: 'if', duty: 'attack' }, def: { x: 68, y: 42, role: 'pf', duty: 'support' } },
        { num: 9, name: 'Sol Hücum', atk: { x: 32, y: 24, role: 'af', duty: 'attack' }, def: { x: 32, y: 42, role: 'pf', duty: 'support' } }
      ]
    }
  ]
};
