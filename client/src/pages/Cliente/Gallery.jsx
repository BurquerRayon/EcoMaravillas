import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../../components/Carousel";
import "../../styles/Gallery.css";
import Footer from "../../components/Footer";
import "../../styles/Footer.css";

const Galeria = () => {
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [filtroHabitat, setFiltroHabitat] = useState("");
  const [especieSeleccionada, setEspecieSeleccionada] = useState(null);
  const navigate = useNavigate();
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null); //estado para mostrar caracteristica//
  const [imagenesMezcladas, setImagenesMezcladas] = useState([]);

  const imagenes = [
    //IMAGENES DE FAUNA//

    //1
    {
      nombre: "Cigua cara amarilla",
      especie: "tiaris olivacea",
      habitat: "Área Exterior",
      caracteristica:
        "Especie residente. Es común verla posada en las cercas de alambres de púas y en ramitas secas amontonadas. El nido es una pequeña copa o globular ubicado cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Cigua.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //2
    {
      nombre: "Pajaro Bob",
      especie: "Surothera longirostris",
      habitat: "Área Exterior",
      caracteristica:
        "Especie endemica. Esta ave es muy útil ya que se alimenta de insectos y larvas dañinas para la agricultura. Es perseguida por su carne que se considera, erroneamente, medicinal. Anida en árboles, entre las ramas, bien escondido. Pone de 2 a 3 huevos blancos. Es una especie con veda permanente.",
      src: "/assets/img/Fauna/Bob.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //3
    {
      nombre: "Lechuza cara ceniza",
      especie: "Tyto glaucops",
      habitat: ["Cueva", "Área Exterior"],
      caracteristica:
        "Especie endémica. Esta ave es muy parecida a la especie Tyto alba, pero ésta es de un color más claro. Anida en cuevas, huecos de árboles y lugares oscuros. ",
      src: "/assets/img/Fauna/Tyto.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //4
    {
      nombre: "Lechuza común",
      especie: "Tyto alba",
      habitat: ["Cueva", "Área Exterior"],
      caracteristica:
        "Las lechuzas son aves nocturnas y se alimentan de pequeñas ratones y Murciélagos. Esta ave es perseguida por falsas creencias de que es de mal agüero. Es una especie protegida con veda permanent. Anida en cuevas, huecos de árboles, edificios abandonados y en otros lugares oscuros. Pone de 2 a 8 huevos blancos. ",
      src: "/assets/img/Fauna/tytoalba.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //5
    {
      nombre: "Marpesia eleuchea ",
      especie: "Nymphalidae",
      habitat: "Área Exterior",
      caracteristica:
        "Es una mariposa caribeña de color leonado con una franja anterior negra, que posee además dos colitas en las alas posteriores. Prefiere los bosques antes que los espacios claros, donde se alimenta de las flores de los árboles. Es especialmente abundante en los meses de junio y julio.",
      src: "/assets/img/Fauna/Marpesia.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //6
    {
      nombre: "Mariposa cola de golondrina de borde dorado",
      especie: "Polydamas swallowtail. Polilionidae",
      habitat: "Área Exterior",
      caracteristica:
        "Mariposa de gran tamaño y colores oscuros. En nuestro país existen solo dos especies de Battus, B. zetides que es endemica y B. polydamas que tiene una distribución amplia en América y en todo el país. A diferencia de la primera, B. polydamas no tiene colitas. Nunca para de agitar las alas cuando se está alimentando.",
      src: "/assets/img/Fauna/Polydamas.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //7
    {
      nombre: " Dryas iulia",
      especie: "Mariposa Julia. Heliconidae ",
      habitat: "Área Exterior",
      caracteristica:
        "Al igual que Agrauls vanillae. Es de color anaranjado, pero la mariposa Julia tiene las alas mucho más alargadas y no posee manchas plateadas. Tiene los mismos hábitos alimenticios. ",
      src: "/assets/img/Fauna/Dryas.webp",
      tipo: "Fauna",
      todas: "todas",
    },
    //8
    {
      nombre: "Junonia genoveva ",
      especie: "Nymphalidae",
      habitat: "Área Exterior",
      caracteristica:
        "Es una mariposa muy esquiva, cuando alguien se le acerca inmediatamente vuela a otro lugar cercano. Tiene grandes ojos falsos marrones en el dorso de sus alas.",
      src: "/assets/img/Fauna/palmarun.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //9

    {
      nombre: "Viuda Negra",
      especie: "Latrodectus mactans",
      habitat: "Cueva",
      caracteristica:
        "Esta araña es conocida por su veneno, que según la creencia usa para atacar al macho de su especie. Aunque se han reportado casos de ataques a humanos, en la isla no se han reportado muertes.",
      src: "/assets/img/Fauna/Mactans.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    //10
    {
      nombre: "taladro del ramo",
      especie: "Trachyderes succintus ",
      habitat: "Área Exterior",
      caracteristica:
        "Este insecto es conocido como ciervo volante o como le llamamos en la isla: chivito volador. Esta especie se alimenta de madera y hace la función de reciclar la materia orgánica para introducirla de nuevo al ambiente en forma de excremento.",
      src: "/assets/img/Fauna/Trachy.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    //11
    {
      nombre: "Chicharra",
      especie: "Cicadidae",
      habitat: "Area Exterior",
      caracteristica:
        "A esta familia pertenecen las famosas chicharras, conocidas por su estruendoso canto. La hembra es muda y el macho es el que canta para atraerla a su nido.",
      src: "/assets/img/Fauna/chicarra.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //12
    {
      nombre: "Abeja",
      especie: "Apis melifera",
      habitat: "Área Exterior",
      caracteristica:
        "Esta es la abaja productora de miel, garantizando la polinización de varias especies arbóreas y frutales. ",
      src: "/assets/img/Fauna/apis.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },
    //13
    {
      nombre: "Rana",
      especie: "Osteopilus dominicensis",
      habitat: ["Área Ácuatica", "Area Exterior"],
      caracteristica:
        "Endémica. Se le conoce como rana arborícola por su tendencia a subirse en los árboles y solo bajar en las noches. Se les encuentra con mucha frecuencia pegada en las paredes de los baños. Habita en varios tipos de ambientes. Se alimenta de insectos y su croar es un canto muy fuerte que se escucha en las noches.",
      src: "/assets/img/Fauna/Ostedomi.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //14
    {
      nombre: "Calcali",
      especie: "Eleutherodactylus Abbotti",
      habitat: ["Área Ácuatica", "Area Exterior"],
      caracteristica:
        "Existen 55 especies de ranas de este grupo en la isla y todas son endémicas. Pertenece al mismo grupo de los coquíes de Puerto Rico. Su canto es frecuente escucharlo en lugares húmedos. Se alimenta de pequeños insectos y a diferencia de otros anfibios no pasa por el estado larvario.",
      src: "/assets/img/Fauna/abbotti.jpg",
      tipo: "Fauna",
      todas: "todas",
    },
    //15
    {
      nombre: "Lagartija común",
      especie: "Anolis ditichus",
      habitat: "Area Exterior",
      caracteristica:
        "Del grupo de los Anolis o lagartos con saco gular. Mide aproximadamente seis centímetros. Habita casi exclusivamente en los árboles, aunque es posible observarlos en el suelo. Es nativa, con una distribución muy amplia en toda la Isla. Habita también en las Bahamas. Su saco gular es amarillo pálido a naranja Brillante o con una mancha central anaranjada, y su cuerpo de color verdoso. Se mueve con destreza y prefiere comer pequeños insectos. Se reproduce a todo lo largo del año. ",
      src: "/assets/img/Fauna/anolis.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //16
    {
      nombre: "Culebra Sabanera ",
      especie: "Antillophis parvifrons",
      habitat: "Area Exterior",
      caracteristica:
        "Otra de las clásicas culebras, que habitan la isla. Es exclusivamente terrestre y se encuentra en todo el territorio nacional, inclusive en el Pico Duarte. De hábitos diurnos. Se alimenta de pequeñas lagartijas, ranitas y algunos insectos. Su cuerpo es de color negro a gris con dos líneas laterales oscura a cada lado del cuerpo.",
      src: "/assets/img/Fauna/culebraS.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //17
    {
      nombre: "Boa de la Hispaniola",
      especie: "Epicrates striatus",
      habitat: ["Cueva", "Area Exterior"],
      caracteristica:
        "Esta es la culebra más grande que existe en la isla, llegando a alcanzar hasta los ocho pies de longitud, aunque se han reportado más grandes. Es nativa de la Hispaniola. Se encuentra también en las Bahamas. Vive sobre los árboles. Se alimenta de huevos, ratones, gallinas, y otros vertebrados. Especie protegida con veda permanente, que puede ser vista en la zona. En peligro de extinción.",
      src: "/assets/img/Fauna/boa.JPG",
      tipo: "Fauna",
      todas: "todas",
    },
    //18
    {
      nombre: "Falsa Boa ",
      especie: "Tropidophis haetianus",
      habitat: "area exterior",
      caracteristica:
        "Especie de culebra muy poco conocida por los dominicanos, ya que tiene hábitos nocturnos, arborícolas y es muy pequeña. Mide aproximadamente 72 centímetros. Prefiere los lugares con mucha vegetación y es algo de humedad. Es completamente inofensiva y se alimenta de ranitas, lagartijas y otros vertebrados. Es nativa de la isla. Habita también en Cuba y Jamaica.",
      src: "/assets/img/Fauna/boaT.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Julián chiví",
      especie: "Vireo Altiloquus",
      habitat: "area exterior",
      caracteristica:
        "Esta ave es muy difícil de localizar por su canto que parece venir de un lugar contrario a donde está el ave. También su color la protege. Su nombre viene de su canto, un interminable Julián chiví. Anida en árboles a una elevación moderada. Pone de 2 a 3 huevos manchados.",
      src: "/assets/img/Fauna/vireo.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Ruiseñor",
      especie: "Mimus polyglottos",
      habitat: "area exterior",
      caracteristica:
        "Esta ave tiene un canto muy hermoso y conocido, pero también imita sonidos y el canto de otras aves. Se alimenta de insectos, pequeñas semillas y frutas. El nido está hecho de ramitas secas y finas, construido en un árbol o arbusto con espinas, no muy alto. Pone de 2 a 3 huevos color gris pálido y manchados.",
      src: "/assets/img/Fauna/Mimus.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Rolon rabiche ",
      especie: "Zenaida macroura",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es muy parecida a Zenaida aurita (Rolón), pero esta última tiene la cola cuadrada, no puntiaguda. Anida en árboles, a mediana altura, en un nido rústico hecho de ramas pequeñas. Pone 2 huevos.",
      src: "/assets/img/Fauna/Rolon.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Rolita",
      especie: "Columbina passerina",
      habitat: "area exterior",
      caracteristica:
        "Es una especie muy común. Esta ave se ve generalmente en el suelo, le gusta caminar. Es muy perseguida por cazadores, pero su población sigue siendo alta, debido a periodos de veda de seis meses al año. Anida en árboles, haciendo un nido rústico de palitos secos. Pone 2 huevos y anida varias veces al año.",
      src: "/assets/img/Fauna/Rolita.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Carpinterio",
      especie: "Melanerpes striatus",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es endémica y una de las aves más abundantes en el país. Su comida consiste principalmente en insectos, que busca picando la corteza de los árboles y algunas frutas, por lo cual ha sido perseguido por nuestros campesinos. Hace su nido en huecos de árboles que el mismo construye",
      src: "/assets/img/Fauna/Carpintero.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Cuyaya",
      especie: "Falco sparverius",
      habitat: "area exterior",
      caracteristica:
        "Esta especie es el halcón más pequeño que habita en la República Dominicana. Es común verla en postes del tendido eléctrico en carreteras y ciudades. A esta ave, llamada de rapiña, se le protege con veda permanente. Ha sido perseguida por la creencia errónea de que come pollos. Se alimenta de pequeños roedores, lagartos e insectos. Pone de 2 a 5 huevos. Anida en huecos de árboles o en pencas de palmas.",
      src: "/assets/img/Fauna/Cuyaya.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Manuelito",
      especie: "Myiarchus stolidus",
      habitat: "Area Exterior",
      caracteristica:
        "Al igual que los demás miembros de la familia, se alimenta de insectos que atrapa en el aire. Esta especie tiene su área de acción cerca del suelo, generalmente volando bajo. Anida en huecos de árboles o en postes. Pone de 3 a 4 huevos manchados.",
      src: "/assets/img/Fauna/Manuelito.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Barrancoli",
      especie: "Touds subulatus",
      habitat: "Area Exterior",
      caracteristica:
        "Ave endémica de la isla. Pertenece a la familia Todidade que es exclusiva de las Antillas Mayores. Es una especie muy parecida al Chicui (Todus angustirostris), pero esa última no se ve en elevaciones bajas, y el canto de las dos especies es muy diferente. Anida es pequeños barrancos, haciendo un hueco en la tierra. Pone de 3 a 4 huevos blancos. Especie protegida con veda permanente.",
      src: "/assets/img/Fauna/Barrancoli.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "la mariposa azufre sin nubes",
      especie: "Phoebis sennae",
      habitat: "Area Exterior",
      caracteristica:
        "Suele acompañar a Kricogonia lyside en sus movimientos migratorios. Aunque tienen coloración similar, Phoebis sennae presenta dos pequeños puntos plateados con borde dorado en el lado inferior de las alas posteriores y uno en las alas anteriores. La larva se alimenta de hojas de leguminosas.",
      src: "/assets/img/Fauna/Pieri.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa blanca.",
      especie: "Ascia Monuste",
      habitat: "Area Exterior",
      caracteristica:
        "Estas mariposas acostumbran tomar sodio del suelo. Cuando una mariposa descubre un buen lugar para tomarlo otras rápidamente la seguirán. Este sodio les ayuda a restablecerse de su esfuerzo en la busqueda de pareja y reponer fuerzas para continuar la migración. Ascia monuste es la más blanca de todas las migrantes y tiene el borde de las alas de color oscuro.",
      src: "/assets/img/Fauna/Ascia.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "La mariposa de San Juan",
      especie: "Kricogonia lyside",
      habitat: "Area Exterior",
      caracteristica:
        "Sin duda alguna es la mariposa más conocida en la República Dominicana. Por razones no comprendidas todavía, emprende grandes migraciones durante los meses de verano, especialmente en el Suroeste y el Este del país. Sus larvas se alimentan de las hojas del Guayacán.",
      src: "/assets/img/Fauna/SanJuan.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Tronadora Caribeña",
      especie: "Hamadryas amphichloe",
      habitat: "Area Exterior",
      caracteristica:
        "Es la única gran mariposa gris de nuestra fauna. Suele posarse de cabeza sobre los troncos de los árboles, o sobre los visitantes que invadan su territorio. Durante los meses de verano es muy abundante en las regiones Sur y Este.",
      src: "/assets/img/Fauna/Amphi.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Saltarina Obscura",
      especie: "Panoquina panoquinoides",
      habitat: "Area Exterior",
      caracteristica:
        "Tiene una gran distribución en toda América. Se distingue por un pequeño punto amarillo en las alas anteriores. Su coloración general es marrón y su vuelo muy rápido. Ocasionalmente, entra en las casas donde se supone que anuncia los visitantes.",
      src: "/assets/img/Fauna/chicarra.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Hiedevivo ",
      especie: "Pentatomidae",
      habitat: "Area Exterior",
      caracteristica:
        "Chinche de plantas. Algunos chinches se alimentan de la savia de las plantas o de otros insectos y mamíferos. Para eso cuentan con un estilete que clavan en sus víctimas. En general no son peligrosos, pero algunos pueden ser muy molestosos. Desprenden un fuerte y desagradable olor, características a la cual debe su nombre común.",
      src: "/assets/img/Fauna/Hiedevivo.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Libelula verde",
      especie: "Erythemis vesiculosa",
      habitat: "Area Exterior",
      caracteristica:
        "Su nombre comun se debe a la extraordinaria coloracion verde que presentan en el cuerpo. Su vuelo es potente ya que es un experto cazador de otros insectos. Es muy comun en la region Este del pais.",
      src: "/assets/img/Fauna/Esmeralda.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Caballito de bandas negras",
      especie: "Erithrodiplax umbrata",
      habitat: "Area acuatica",
      caracteristica:
        "Conocido comúnmente como Caballito del Diablo. Habita en charcas o lugares asociados con pozos de agua. Es una especie totalmente carnívora, depredadora de otros invertebrados y de pequeños vertebrados, como los renacuajos de las ranas.",
      src: "/assets/img/Fauna/Banda.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Culebra Verde Hocico Puntiagudo",
      especie: "Uromacer Catesbyi",
      habitat: "Area Exterior",
      caracteristica:
        "Especie endémica. Las culebras verdes son las más características culebras de la isla, ya que son bien conocidas por los dominicanos, y pocas veces las matan. Aunque alcanzan longitudes de casi cinco pies de largo, son muy delgadas. Habitan en los arbustos, donde se desplazan con mucha gracia. Se alimenta de pequeños vertebrados, como lagartijas, ranitas y, pequeñas aves. Presenta un color verde oscuro a todo lo largo del cuerpo con la punta de la boca roma.",
      src: "/assets/img/Fauna/culebraV.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Culebra Verde Hocico Puntiagudo",
      especie: "Uromacer oxyrhynchus",
      habitat: "Area Exterior",
      caracteristica:
        "Otra de las tres especies de culebras verde que habitan en la isla. Todas endémicas. Alcanza hasta cinco pies de largo. A diferencia de la catesbyi, el cuerpo es verde olivo en la parte dorsal, con un verde más claro en la parte lateroinferior, separados ambos colores por una clara línea de color blanca o amarillenta. Se alimentan de pequeños vertebrados y habitan en una gran variedad de ambiente a todo lo largo de la isla. Es exclusivamente arborícola.",
      src: "assets/img/Fauna/CulebraVU.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Gallito prieto ",
      especie: "Loxigilla violacea",
      habitat: "Area Exterior",
      caracteristica:
        "La combinación de los colores negro y rojo le dan una hermosa apariencia a esta ave. Es muy activa y hay que estar muy atento para poder verla. Es común pero poco conocida. Anida en arbustos cerca del suelo. Pone 3 huevos manchados.",
      src: "/assets/img/Fauna/Loxi.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Cuatro ojos ",
      especie: "Phaenicophilus palmarum",
      habitat: "Area Exterior",
      caracteristica:
        "Especie Endémica. Esta hermosa ave es muy común, ya que se le puede ver hasta en los jardines y patios en las ciudades. El nido tiene forma de copa. Pone de 3 a 4 huevos verdes y manchados.",
      src: "/assets/img/Fauna/palmarun.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "mariposa cebra",
      especie: "Heliconius charitonius",
      habitat: "Area Exterior",
      caracteristica:
        "La mariposa cebra es de amplia distribucion en el trópico americano. Es fácilmente distinguible por rayas intercaladas negras y amarillas brillantes de las cuales proviene su nombre. Prefiere los bosques húmedos de baja o mediana elevación.",
      src: "/assets/img/Fauna/Heli.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa Pavoreal Blanca",
      especie: "Anartia jatrophae",
      habitat: "Area Exterior",
      caracteristica:
        "Una de las mariposas mas comunes en prados y jardines. Se caractiza por la presencia de dos ojos. Es muy agresiva con otras mariposas. Su vuelo es bajo y delicado.",
      src: "/assets/img/Fauna/Peacock.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Espejitos",
      especie: "Agraulis vanillae",
      habitat: "Area Exterior",
      caracteristica:
        "Es el heliconiido anaranjado más común de la República Dominicana. Su abundancia en las zonas urbanas se debe a que se alimenta de chinolas (Pasiflora edulis). Se puede reconocer fácilmente por sus peculiares manchas plateadas bien visibles en la parte ventral de las alas cuando la mariposa esta alimentándose de las flores.",
      src: "/assets/img/Fauna/Vani.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa de borde rojo",
      especie: "Biblis hyperia",
      habitat: "Area Exterior",
      caracteristica:
        "Es la única especie de nuestro país que posee una franja roja sobre fondo negro. Sus larvas se alimentan de pica-pica (gratey). Vive principalmente en la región Este del país.",
      src: "/assets/img/Fauna/bordeR.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa golondrina zebra",
      especie: "Protesilaus zonarius",
      habitat: "Area Exterior",
      caracteristica:
        "Mariposa endémica de la isla de Santo Domingo. De vuelo rápido y bajo. Habita comúnmente en el bosque seco y es especialmente observada en los meses de junio y julio. Pertenece al grupo conocido como 'colar de golondrina' (swallow-tail).",
      src: "/assets/img/Fauna/Prote.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Saltarina de Cola Larga",
      especie: "Urbanus dorantes",
      habitat: "Área exterior",
      caracteristica:
        "Esta mariposa presenta poco dimorfismo sexual entre machos y hembras y al igual que Eunica monima, es común en todos los ambientes de la isla. Habita, además, en América continental y el Caribe.",
      src: "/assets/img/Fauna/Urbanus.jpeg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa emperatriz de banda amarilla",
      especie: "Asterocampa idyia",
      habitat: "Area exterior",
      caracteristica:
        "Esta mariposa presenta también un gran dimorfismos sexual entre machos y hembras, ya que el macho es de un color más oscuro que la hembra, y esta presenta marcas azules y blancas, y diferencias en el tamaño, color y forma de las alas. Son muy comunes en toda la isla, especialmente en lugares arbóreos y ocasionalmente cerca de plantanaciones frutales.",
      src: "/assets/img/Fauna/idyia.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariposa de Alas Púrpura Oscura",
      especie: "Eunica Monima (Nymphalidae)",
      habitat: "Area exterior",
      caracteristica:
        "Esta mariposa presenta poca diferencia entre el macho y la hembra. Es muy comun en toda la isla, incluso en las ciudades. Se observan en mayor cantidad durante el verano. Habitan tambien en America continental y las Antillas.",
      src: "/assets/img/Fauna/eunica.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Mariguanita",
      especie: "Leiocephalus lunatus",
      habitat: "Area Exterior",
      caracteristica:
        "Lagarto endémico de nuestra isla. Mide aproximadamente siente centímetros. Habita a todo lo largo de la costa Este, desde Santo Domingo hasta Higüey. Una característica peculiar de este animal es que presenta las patas posteriores de color verde con la cola rojiza. Prefiere lugares rocosos y soleados donde pasar varias horas calentándose. Se alimenta de insectos y su reproducción es ovípara. ",
      src: "/assets/img/Fauna/marihuanaL.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Lagarto Enmascarado de Cola Rizada",
      especie: "Leiocephalus personatus",
      habitat: "Area Exterior",
      caracteristica:
        "Del mismo grupo de la lunatus. Mide aproximadamente 8 centímetros y medio. La principal característica de este grupo de lagarto es que cuando descansan, su cola se enrolla hacia arriba en forma de un semi-círculo. A diferencia de lunatus, esta especie presenta las patas posteriores al igual que la cola de un color rojizo. Se alimentan de pequeños insectos y su reproducción es ovípara.",
      src: "/assets/img/Fauna/marihuanaL.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    {
      nombre: "Lagarto verde ",
      especie: "Anolis Chlorocyanus",
      habitat: "Area Exterior",
      caracteristica:
        "Endémica. Está siendo sustituida por otra especie de lagarto verde introducida de Cuba y que habita la copa de los árboles, al igual que la nuestra. Presenta el saco gular azuloso, mientras que el introducido lo presenta de color rosado. Mide 8 centímetros de largo. Habita preferiblemente en la copa de árboles altos. Se alimenta de insectos como esperanza, grillos y otros lagartos más pequeños.",
      src: "/assets/img/Fauna/lagartoV.jpg",
      tipo: "Fauna",
      todas: "todas",
    },

    //IMAGENES DE FLORA//

    {
      nombre: "Guayacán",
      especie: "Guaicum officinale L.Zygophyllaceae",
      habitat: "Area Exterior",
      caracteristica:
        "Arbol de hasta 10 m. de altura, con hojas de 3 a 9 cm., compuestas de 4 a 6 foliolos u hojuelas de 1.5 cm., redondeadas. Flores de petalos azules abovados, de 12 mm. Frutos de 15 a 20 mm., de color anaranjado o amarillo.",
      src: "/assets/img/Flora/Guayacan.jpg",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    {
      nombre: "",
      especie: "",
      habitat: "",
      caracteristica: "",
      src: "",
      tipo: "Flora",
      todas: "todas",
    },

    // Agrega más imágenes si lo deseas...
  ];

  //Función para mezclar el array de imágenes (aleatorizar el orden)
  function mezclarArray(array) {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  // Aplica mezcla a las imágenes
  useEffect(() => {
    setImagenesMezcladas(mezclarArray(imagenes));
  }, []);

  const resultados = imagenesMezcladas.filter((img) => {
    const especieEsTodas = filtroEspecie === "" || filtroEspecie === "Todas";
    const habitatEsTodos = filtroHabitat === "" || filtroHabitat === "Todos";

    if (especieEsTodas && habitatEsTodos) {
      return true;
    }

    const especieMatch = especieEsTodas || img.tipo === filtroEspecie;

    // Normaliza tildes y mayúsculas para evitar errores
    const normalizar = (texto) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const filtroHabitatNormalizado = normalizar(filtroHabitat);

    const habitatMatch =
      habitatEsTodos ||
      (Array.isArray(img.habitat)
        ? img.habitat.some((h) => normalizar(h) === filtroHabitatNormalizado)
        : normalizar(img.habitat) === filtroHabitatNormalizado);

    return especieMatch && habitatMatch;
  });

  /*const hayFiltros = filtroEspecie || filtroHabitat; */

  return (
    <div className="page-wrapper">
      <main className="content">
        <div className="galeria-container">
          <button className="btn-salir" onClick={() => navigate("/")}>
            ← Volver al Inicio
          </button>

          <h1>Galería de Especies</h1>
          <p>
            Explora nuestras imágenes rotativas o filtra por especie/hábitat:
          </p>

          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="filter-tipo">Filtrar por especie</label>
              <select
                id="filter-tipo"
                onChange={(e) => setFiltroEspecie(e.target.value)}
              >
                <option value="Todas">Todas las especies</option>
                <option value="Fauna">Fauna</option>
                <option value="Flora">Flora</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-habitat">Filtrar por hábitat</label>
              <select
                id="filter-habitat"
                onChange={(e) => setFiltroHabitat(e.target.value)}
              >
                <option value="Todos">Todos los hábitats</option>
                <option value="Cueva">Cueva</option>
                <option value="Área Ácuatica">Área Ácuatica</option>
                <option value="Área Exterior">Área Exterior</option>
              </select>
            </div>
          </div>

          {/* {!hayFiltros ? (
            <div className="carousel-container">
              <Carrusel />
            </div>
          ) : ( */}
          <div className="resultados-grid">
            {resultados.length > 0 ? (
              resultados.map((img, idx) => (
                <div
                  className="result-card"
                  key={idx}
                  /*onClick={() => setEspecieSeleccionada(img)} */
                  onClick={() => setEspecieSeleccionada(img)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={img.src} alt={img.nombre} className="result-img" />
                  <h3>{img.nombre}</h3>
                  <p>
                    <strong>Especie:</strong> {img.especie}
                  </p>
                  <p>
                    <strong>Hábitat:</strong> {img.habitat}
                  </p>
                  {/*img.caracteristica && (
                      <p>
                        <strong>Características:</strong> {img.caracteristica}
                      </p>
                    ) */}
                </div>
              ))
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>
          {/* )} */}

          {/* Vista detallada al hacer clic */}
          {especieSeleccionada && (
            <div className="detalle-especie">
              <button
                className="btn-cerrar"
                onClick={() => setEspecieSeleccionada(null)}
              >
                X
              </button>
              <img
                src={especieSeleccionada.src}
                alt={especieSeleccionada.nombre}
                className="imagen-detalle"
              />
              <h2>{especieSeleccionada.nombre}</h2>
              <p>
                <strong>Nombre científico:</strong>{" "}
                {especieSeleccionada.especie}
              </p>
              <p>
                <strong>Hábitat:</strong> {especieSeleccionada.habitat}
              </p>
              {especieSeleccionada.caracteristica && (
                <p>
                  <strong>Características:</strong>{" "}
                  {especieSeleccionada.caracteristica}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Galeria;
