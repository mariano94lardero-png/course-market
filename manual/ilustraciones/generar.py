"""Genera las ilustraciones SVG del manual «Gana tu día».

Todas son dibujos originales hechos con formas simples, en la paleta de la
marca (fondo claro, verdes y un toque cálido). Uso: python3 generar.py
"""
from pathlib import Path

OUT = Path(__file__).parent

VERDE = "#2E7D4F"
OSCURO = "#24543A"
CLARO = "#CFE6D6"
FONDO = "#EEF6F0"
CALIDO = "#F2C94C"
BLANCO = "#FFFFFF"
TEXTO = "#1F2A24"

S = f'stroke="{OSCURO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"'


# --- Iconos en una caja de 200 x 200 -------------------------------------

def brujula():
    return f'''<circle cx="100" cy="100" r="70" fill="{BLANCO}" {S}/>
<circle cx="100" cy="100" r="54" fill="none" stroke="{CLARO}" stroke-width="4"/>
<polygon points="100,46 114,100 100,154 86,100" fill="{VERDE}"/>
<polygon points="100,100 114,100 100,154 86,100" fill="{CALIDO}"/>
<circle cx="100" cy="100" r="7" fill="{OSCURO}"/>'''


def tres_habitos():
    out = ""
    for i, c in enumerate([VERDE, CALIDO, OSCURO]):
        y = 45 + i * 50
        out += f'''<rect x="40" y="{y}" width="120" height="36" rx="12" fill="{BLANCO}" {S}/>
<circle cx="64" cy="{y + 18}" r="10" fill="{c}"/>
<path d="M84 {y + 18} H140" stroke="{CLARO}" stroke-width="6" stroke-linecap="round"/>'''
    return out


def punto_partida():
    return f'''<ellipse cx="100" cy="165" rx="60" ry="14" fill="{CLARO}"/>
<path d="M100 160 C60 110 55 90 55 75 a45 45 0 0 1 90 0 c0 15 -5 35 -45 85z" fill="{VERDE}" {S}/>
<circle cx="100" cy="75" r="18" fill="{BLANCO}"/>'''


def entorno():
    return f'''<path d="M40 95 L100 45 L160 95" fill="none" {S}/>
<rect x="55" y="90" width="90" height="75" rx="6" fill="{BLANCO}" {S}/>
<rect x="88" y="120" width="26" height="45" rx="4" fill="{VERDE}"/>
<rect x="64" y="104" width="18" height="16" rx="3" fill="{CALIDO}"/>
<rect x="120" y="104" width="18" height="16" rx="3" fill="{CALIDO}"/>
<path d="M30 168 H170" {S}/>'''


def tarjeta_modos():
    return f'''<rect x="35" y="45" width="130" height="110" rx="14" fill="{BLANCO}" {S}/>
<rect x="52" y="66" width="96" height="16" rx="8" fill="{VERDE}"/>
<rect x="52" y="92" width="64" height="16" rx="8" fill="{CALIDO}"/>
<rect x="52" y="118" width="34" height="16" rx="8" fill="{OSCURO}"/>
<circle cx="150" cy="50" r="10" fill="{CALIDO}" {S}/>'''


def check():
    return f'''<rect x="45" y="45" width="110" height="110" rx="22" fill="{BLANCO}" {S}/>
<path d="M70 102 L92 124 L134 78" fill="none" stroke="{VERDE}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>'''


def calendario(marcas=(0, 1, 3, 4, 6), titulo=None):
    out = f'''<rect x="30" y="45" width="140" height="120" rx="12" fill="{BLANCO}" {S}/>
<rect x="30" y="45" width="140" height="30" rx="12" fill="{VERDE}"/>
<rect x="30" y="62" width="140" height="13" fill="{VERDE}"/>
<path d="M65 35 V55 M135 35 V55" {S}/>'''
    if titulo:
        out += f'<text x="100" y="135" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="42" fill="{OSCURO}">{titulo}</text>'
        return out
    for i in range(7):
        x = 46 + (i % 4) * 36
        y = 95 + (i // 4) * 36
        fill = VERDE if i in marcas else CLARO
        out += f'<circle cx="{x}" cy="{y}" r="11" fill="{fill}"/>'
    return out


def luna():
    return f'''<path d="M120 45 a60 60 0 1 0 40 95 a48 48 0 1 1 -40 -95z" fill="{CALIDO}" {S}/>
<path d="M55 55 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z" fill="{VERDE}"/>
<circle cx="160" cy="70" r="5" fill="{VERDE}"/>
<circle cx="45" cy="120" r="4" fill="{VERDE}"/>'''


def taza():
    return f'''<path d="M50 85 H135 V125 a35 35 0 0 1 -35 35 H85 a35 35 0 0 1 -35 -35z" fill="{BLANCO}" {S}/>
<path d="M135 95 h10 a18 18 0 0 1 0 36 h-12" fill="none" {S}/>
<path d="M75 70 c-8 -12 8 -18 0 -30 M95 70 c-8 -12 8 -18 0 -30 M115 70 c-8 -12 8 -18 0 -30" fill="none" stroke="{VERDE}" stroke-width="6" stroke-linecap="round"/>
<path d="M40 170 H150" {S}/>'''


def huellas():
    def pie(x, y, rot):
        return f'''<g transform="translate({x} {y}) rotate({rot})">
<ellipse cx="0" cy="0" rx="13" ry="22" fill="{VERDE}"/>
<circle cx="-8" cy="-30" r="4" fill="{VERDE}"/><circle cx="0" cy="-33" r="4" fill="{VERDE}"/><circle cx="8" cy="-30" r="4" fill="{VERDE}"/></g>'''
    return pie(70, 150, -10) + pie(110, 110, 10) + pie(80, 70, -10) + pie(125, 40, 10)


def corazon():
    return f'''<path d="M100 165 C40 125 35 95 35 78 a32 32 0 0 1 65 -8 a32 32 0 0 1 65 8 c0 17 -5 47 -65 87z" fill="{VERDE}" {S}/>
<path d="M45 105 H78 L88 85 L102 125 L114 100 H155" fill="none" stroke="{BLANCO}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'''


def plato():
    return f'''<circle cx="100" cy="105" r="55" fill="{BLANCO}" {S}/>
<circle cx="100" cy="105" r="36" fill="{CLARO}"/>
<circle cx="90" cy="98" r="10" fill="{VERDE}"/><circle cx="110" cy="112" r="8" fill="{CALIDO}"/>
<path d="M30 60 V95 M22 60 V80 a8 8 0 0 0 16 0 V60 M30 95 V160" {S} fill="none"/>
<path d="M170 60 c-14 10 -14 40 0 45 V160" {S} fill="none"/>'''


def bateria():
    return f'''<rect x="40" y="65" width="110" height="70" rx="12" fill="{BLANCO}" {S}/>
<rect x="150" y="88" width="12" height="24" rx="4" fill="{OSCURO}"/>
<rect x="52" y="77" width="44" height="46" rx="6" fill="{CALIDO}"/>
<path d="M118 78 l-12 24 h14 l-12 24" fill="none" stroke="{VERDE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'''


def reloj():
    return f'''<circle cx="100" cy="105" r="62" fill="{BLANCO}" {S}/>
<path d="M100 105 V68 M100 105 L128 120" stroke="{VERDE}" stroke-width="8" stroke-linecap="round"/>
<circle cx="100" cy="105" r="6" fill="{OSCURO}"/>
<path d="M100 48 v8 M100 154 v8 M43 105 h8 M149 105 h8" {S}/>
<path d="M150 40 a70 70 0 0 1 20 30" fill="none" stroke="{CALIDO}" stroke-width="6" stroke-linecap="round"/>'''


def primer_paso():
    return f'''<path d="M30 160 H70 V130 H110 V100 H150 V70 H175" fill="none" {S}/>
<circle cx="50" cy="135" r="14" fill="{VERDE}"/>
<path d="M150 70 V40 l22 8 l-22 8" fill="{CALIDO}" {S}/>'''


def bloques():
    out = ""
    for i, (x, y) in enumerate([(40, 115), (85, 115), (130, 115), (62, 70), (107, 70), (85, 25)]):
        c = VERDE if i < 3 else (CALIDO if i < 5 else CLARO)
        out += f'<rect x="{x}" y="{y}" width="40" height="40" rx="8" fill="{c}" {S}/>'
    return out + f'<path d="M30 162 H180" {S}/>'


def movil_silencio():
    return f'''<rect x="62" y="35" width="76" height="135" rx="14" fill="{BLANCO}" {S}/>
<path d="M90 50 H110" {S}/>
<path d="M82 120 c0 -30 8 -42 18 -42 s18 12 18 42 l6 8 H76z" fill="{CALIDO}" {S}/>
<path d="M72 70 L130 140" stroke="{VERDE}" stroke-width="8" stroke-linecap="round"/>'''


def bocadillo():
    return f'''<path d="M40 50 H160 a14 14 0 0 1 14 14 V120 a14 14 0 0 1 -14 14 H90 L60 160 V134 H40 a14 14 0 0 1 -14 -14 V64 a14 14 0 0 1 14 -14z" fill="{BLANCO}" {S}/>
<path d="M100 118 C75 102 72 92 72 86 a14 14 0 0 1 28 -3 a14 14 0 0 1 28 3 c0 6 -3 16 -28 32z" fill="{VERDE}"/>'''


def retomar():
    return f'''<path d="M150 105 a50 50 0 1 1 -18 -38" fill="none" stroke="{VERDE}" stroke-width="12" stroke-linecap="round"/>
<path d="M118 50 L140 66 L118 84" fill="none" stroke="{VERDE}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="100" cy="105" r="14" fill="{CALIDO}"/>'''


def personas():
    return f'''<circle cx="75" cy="70" r="22" fill="{VERDE}"/>
<path d="M35 160 c0 -35 18 -55 40 -55 s40 20 40 55z" fill="{VERDE}"/>
<circle cx="130" cy="80" r="20" fill="{CALIDO}"/>
<path d="M95 160 c0 -30 16 -48 35 -48 s35 18 35 48z" fill="{CALIDO}" {S}/>'''


def balanza():
    return f'''<path d="M100 45 V160 M70 160 H130 M45 70 H155" {S}/>
<path d="M45 70 L25 115 H65z M155 70 L135 115 H175z" fill="none" {S}/>
<path d="M25 115 a20 12 0 0 0 40 0z" fill="{VERDE}"/>
<path d="M135 115 a20 12 0 0 0 40 0z" fill="{CALIDO}"/>
<circle cx="100" cy="45" r="8" fill="{OSCURO}"/>'''


def escudo():
    return f'''<path d="M100 35 L160 58 V100 c0 35 -25 58 -60 72 c-35 -14 -60 -37 -60 -72 V58z" fill="{VERDE}" {S}/>
<path d="M100 72 l9 19 l21 3 l-15 15 l4 21 l-19 -10 l-19 10 l4 -21 l-15 -15 l21 -3z" fill="{CALIDO}"/>'''


def limite():
    return f'''<circle cx="100" cy="100" r="68" fill="none" stroke="{VERDE}" stroke-width="6" stroke-dasharray="14 12"/>
<circle cx="100" cy="82" r="18" fill="{VERDE}"/>
<path d="M68 140 c0 -24 14 -38 32 -38 s32 14 32 38z" fill="{VERDE}"/>
<circle cx="172" cy="150" r="10" fill="{CALIDO}"/><circle cx="28" cy="50" r="8" fill="{CALIDO}"/>'''


def lupa_moneda():
    return f'''<circle cx="80" cy="85" r="30" fill="{CALIDO}" {S}/>
<text x="80" y="97" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="32" fill="{OSCURO}">€</text>
<circle cx="95" cy="95" r="52" fill="none" stroke="{VERDE}" stroke-width="10"/>
<path d="M133 133 L168 168" stroke="{VERDE}" stroke-width="16" stroke-linecap="round"/>'''


def tarta():
    return f'''<circle cx="100" cy="105" r="62" fill="{CLARO}" {S}/>
<path d="M100 105 V43 A62 62 0 0 1 159 124z" fill="{VERDE}"/>
<path d="M100 105 L159 124 A62 62 0 0 1 72 160z" fill="{CALIDO}"/>
<circle cx="100" cy="105" r="62" fill="none" {S}/>'''


def bombilla():
    return f'''<path d="M100 35 a45 45 0 0 1 27 81 c-6 5 -9 12 -9 20 H82 c0 -8 -3 -15 -9 -20 a45 45 0 0 1 27 -81z" fill="{CALIDO}" {S}/>
<path d="M84 150 H116 M88 166 H112" {S}/>
<path d="M92 120 V100 l8 -10 l8 10 V120" fill="none" stroke="{OSCURO}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30 70 h14 M156 70 h14 M45 30 l10 10 M155 30 l-10 10" stroke="{VERDE}" stroke-width="6" stroke-linecap="round"/>'''


def brote():
    return f'''<path d="M50 145 H150 L140 175 H60z" fill="{CALIDO}" {S}/>
<path d="M100 145 V85" {S}/>
<path d="M100 105 C70 105 55 85 55 60 C85 60 100 78 100 105z" fill="{VERDE}" {S}/>
<path d="M100 90 C125 90 145 72 145 45 C118 45 100 62 100 90z" fill="{VERDE}" {S}/>'''


def alerta():
    return f'''<path d="M100 35 L172 160 H28z" fill="{CALIDO}" {S}/>
<path d="M100 80 V120" stroke="{OSCURO}" stroke-width="12" stroke-linecap="round"/>
<circle cx="100" cy="140" r="7" fill="{OSCURO}"/>'''


def paraguas():
    return f'''<path d="M30 100 a70 70 0 0 1 140 0 c-12 -10 -24 -10 -35 0 c-12 -10 -24 -10 -35 0 c-12 -10 -24 -10 -35 0 c-12 -10 -24 -10 -35 0z" fill="{VERDE}" {S}/>
<path d="M100 100 V155 a12 12 0 0 1 -24 0" fill="none" {S}/>
<path d="M45 35 l-6 14 M70 22 l-6 14 M150 30 l-6 14" stroke="{CALIDO}" stroke-width="6" stroke-linecap="round"/>'''


def camino_bandera():
    return f'''<path d="M20 165 L80 85 L110 120 L140 70 L185 165z" fill="{CLARO}" {S}/>
<path d="M140 70 V25" {S}/>
<path d="M140 27 L172 38 L140 50z" fill="{CALIDO}" {S}/>
<path d="M60 165 C80 140 100 150 120 130" fill="none" stroke="{VERDE}" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/>'''


def portapapeles():
    out = f'''<rect x="45" y="40" width="110" height="135" rx="12" fill="{BLANCO}" {S}/>
<rect x="75" y="30" width="50" height="22" rx="6" fill="{VERDE}" {S}/>'''
    for i, c in enumerate([VERDE, CALIDO, VERDE]):
        y = 78 + i * 30
        out += f'''<rect x="62" y="{y}" width="18" height="18" rx="4" fill="{c}"/>
<path d="M92 {y + 9} H138" stroke="{CLARO}" stroke-width="6" stroke-linecap="round"/>'''
    return out


def salvavidas():
    return f'''<circle cx="100" cy="100" r="66" fill="{BLANCO}" {S}/>
<circle cx="100" cy="100" r="30" fill="{FONDO}" {S}/>
<path d="M100 34 A66 66 0 0 1 147 53 L121 79 A30 30 0 0 0 100 70z" fill="{VERDE}"/>
<path d="M166 100 A66 66 0 0 1 147 147 L121 121 A30 30 0 0 0 130 100z" fill="{CALIDO}"/>
<path d="M100 166 A66 66 0 0 1 53 147 L79 121 A30 30 0 0 0 100 130z" fill="{VERDE}"/>
<path d="M34 100 A66 66 0 0 1 53 53 L79 79 A30 30 0 0 0 70 100z" fill="{CALIDO}"/>
<circle cx="100" cy="100" r="66" fill="none" {S}/><circle cx="100" cy="100" r="30" fill="none" {S}/>'''


def sol():
    rayos = "".join(
        f'<path d="M100 100 m0 -62 v-16" stroke="{CALIDO}" stroke-width="8" stroke-linecap="round" transform="rotate({a} 100 100)"/>'
        for a in range(0, 360, 45))
    return f'''{rayos}<circle cx="100" cy="100" r="40" fill="{CALIDO}" {S}/>
<path d="M84 104 a16 14 0 0 0 32 0" fill="none" stroke="{OSCURO}" stroke-width="5" stroke-linecap="round"/>
<circle cx="88" cy="92" r="4" fill="{OSCURO}"/><circle cx="112" cy="92" r="4" fill="{OSCURO}"/>'''


# --- Composición ----------------------------------------------------------

def cabecera(icono, etiqueta, subtitulo):
    """Banda horizontal de 800 x 240 con icono, etiqueta y subtítulo."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" role="img" aria-label="{etiqueta}: {subtitulo}">
<rect width="800" height="240" rx="24" fill="{FONDO}"/>
<circle cx="700" cy="40" r="90" fill="{CLARO}" opacity="0.6"/>
<circle cx="760" cy="210" r="40" fill="{CALIDO}" opacity="0.35"/>
<circle cx="40" cy="220" r="50" fill="{CLARO}" opacity="0.5"/>
<g transform="translate(70 20)">{icono}</g>
<text x="320" y="105" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="40" fill="{VERDE}">{etiqueta}</text>
<text x="320" y="150" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" fill="{TEXTO}">{subtitulo}</text>
<rect x="320" y="172" width="70" height="8" rx="4" fill="{CALIDO}"/>
</svg>'''


DIAS = [
    (brujula, "Tu brújula"),
    (tres_habitos, "Cuerpo, mente y dinero"),
    (punto_partida, "Estás aquí, y está bien"),
    (entorno, "Un entorno a tu favor"),
    (tarjeta_modos, "Habitual, reducida, cuidado"),
    (check, "Promesas pequeñas, cumplidas"),
    (lambda: calendario(), "Revisar sin juzgar"),
    (luna, "Primero, el descanso"),
    (taza, "Un comienzo sencillo"),
    (huellas, "Desde donde estás"),
    (corazon, "Moverte para cuidarte"),
    (plato, "Comer fácil"),
    (bateria, "Esfuerzo y descanso"),
    (reloj, "A tu energía y tu horario"),
    (primer_paso, "Empieza por el primer paso"),
    (bloques, "Paso a paso"),
    (movil_silencio, "Tu atención es tuya"),
    (bocadillo, "Háblate con respeto"),
    (retomar, "Volver también es avanzar"),
    (personas, "No tienes que hacerlo a solas"),
    (balanza, "Lo que suma y lo que resta"),
    (escudo, "Honestidad, respeto, responsabilidad"),
    (limite, "Límites claros y amables"),
    (lupa_moneda, "Mirar sin culpa"),
    (tarta, "Un plan para tu dinero"),
    (bombilla, "Aprender algo nuevo"),
    (brote, "Un paso concreto"),
    (alerta, "Sin atajos"),
    (paraguas, "Un plan para cuando llueva"),
    (camino_bandera, "Tus próximos 90 días"),
]

SEMANAS = [
    (1, brujula, "Los cimientos"),
    (2, corazon, "Cuerpo y energía"),
    (3, bocadillo, "Mente y relaciones"),
    (4, tarta, "Carácter, dinero y futuro"),
]

ANEXOS = {
    "plan-90-dias": (lambda: calendario(titulo="90"), "Plan de continuidad", "Mantener, ajustar, proyectar"),
    "registro-semanal": (portapapeles, "Registro semanal", "Cuenta días, no rachas"),
    "emergencia": (salvavidas, "Hoy estoy de bajón", "Una sola cosa pequeña"),
    "cierre": (sol, "Cierre", "Vuelve cuando lo necesites"),
}


def portada():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="Portada de Gana tu día">
<rect width="800" height="1000" fill="#FAFAF7"/>
<circle cx="400" cy="640" r="150" fill="{CALIDO}"/>
<path d="M0 640 C200 560 300 640 400 600 S650 540 800 600 V1000 H0z" fill="{CLARO}"/>
<path d="M0 720 C220 650 360 760 520 700 S720 660 800 690 V1000 H0z" fill="{VERDE}"/>
<path d="M330 1000 C360 900 420 860 400 780 C390 740 420 720 440 700" fill="none" stroke="#FAFAF7" stroke-width="16" stroke-dasharray="2 28" stroke-linecap="round"/>
<text x="400" y="190" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="104" fill="{VERDE}">Gana tu día</text>
<text x="400" y="265" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="{TEXTO}">30 días para construir</text>
<text x="400" y="310" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="{TEXTO}">una vida más fuerte</text>
<rect x="355" y="340" width="90" height="10" rx="5" fill="{CALIDO}"/>
<text x="400" y="400" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" fill="{OSCURO}">Hábitos, disciplina y valores para cuidar</text>
<text x="400" y="432" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="22" fill="{OSCURO}">tu cuerpo, tu mente y tu dinero</text>
</svg>'''


def tres_modos():
    """Esquema de los tres modos de rutina."""
    def columna(x, color, ancho_barras, titulo, linea1, linea2):
        barras = "".join(
            f'<rect x="{x + 40}" y="{120 + i * 30}" width="{w}" height="16" rx="8" fill="{color}"/>'
            for i, w in enumerate(ancho_barras))
        return f'''<rect x="{x}" y="40" width="230" height="300" rx="20" fill="{BLANCO}" stroke="{CLARO}" stroke-width="4"/>
<text x="{x + 115}" y="90" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="26" fill="{OSCURO}">{titulo}</text>
{barras}
<text x="{x + 115}" y="275" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="{TEXTO}">{linea1}</text>
<text x="{x + 115}" y="300" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="18" fill="{TEXTO}">{linea2}</text>'''
    flecha = lambda x: f'<path d="M{x} 190 h24 m-10 -10 l10 10 l-10 10" fill="none" stroke="{VERDE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" role="img" aria-label="Los tres modos de rutina: habitual, reducida y modo cuidado">
<rect width="800" height="380" rx="24" fill="{FONDO}"/>
{columna(20, VERDE, (150, 150, 150), "Habitual", "Lo previsto para", "un día normal")}
{flecha(253)}
{columna(285, CALIDO, (90, 60, 40), "Reducida", "Menos tareas o", "menos esfuerzo")}
{flecha(518)}
{columna(550, OSCURO, (40, 0, 0), "Cuidado", "Lo básico y", "pedir apoyo")}
<path d="M565 150 c0 -18 12 -24 20 -10 c8 -14 20 -8 20 10 c0 14 -20 26 -20 26 s-20 -12 -20 -26z" transform="translate(40 30)" fill="{CALIDO}"/>
</svg>'''


def main():
    (OUT / "portada.svg").write_text(portada(), encoding="utf-8")
    (OUT / "tres-modos.svg").write_text(tres_modos(), encoding="utf-8")
    for n, (icono, sub) in enumerate(DIAS, start=1):
        (OUT / f"dia-{n:02d}.svg").write_text(cabecera(icono(), f"Día {n}", sub), encoding="utf-8")
    for n, icono, sub in SEMANAS:
        (OUT / f"semana-{n}.svg").write_text(cabecera(icono(), f"Semana {n}", sub), encoding="utf-8")
    for nombre, (icono, etiqueta, sub) in ANEXOS.items():
        (OUT / f"{nombre}.svg").write_text(cabecera(icono(), etiqueta, sub), encoding="utf-8")


if __name__ == "__main__":
    main()
