const SERVER_REMOTE = import.meta.env.VITE_SERVER_REMOTE;
const SERVER_LOCAL = import.meta.env.VITE_SERVER_LOCAL;
const TYPE_SERVER = import.meta.env.VITE_TYPE_SERVER;
const SERVER_USE = import.meta.env.VITE_SERVER_USE;
let SERVER;

if(SERVER_USE == 'local'){
  SERVER = SERVER_LOCAL;
} else {
  SERVER = SERVER_REMOTE;
}

let informe = { primero: 'nada', segundo: 'nada' };

function createQuerySQL(type, params) {
  if (typeof type !== 'string') {
    throw new Error('type debe ser un string');
  }

  if (!['select', 'insert', 'update', 'delete'].includes(type)) {
    throw new Error('type debe ser uno de: select, insert, update, delete');
  }

  if (!(params instanceof Object)) {
    throw new Error('params debe ser un objeto');
  }

  if (!params.t) {
    throw new Error("params['t'] debe estar definido dentro del objeto");
  }

  const validColumns = /^\w+(,\s*\w+)*$/;

  let query = '';
  switch (type) {
    case 'select':
      const columns = params.c ? (validColumns.test(params.c) ? params.c : '*') : '*';
      const table = params.t;
      const join = params.j ? ` ${params.j}` : '';
      const where = params.w ? ` WHERE ${params.w}` : '';
      const groupBy = params.g ? ` GROUP BY ${params.g}` : '';
      const having = params.h ? ` HAVING ${params.h}` : '';
      const order = params.o ? ` ORDER BY ${params.o}` : '';
      const limit = params.l ? ` LIMIT ${params.l}` : ' LIMIT 100';
      query = `SELECT ${columns} FROM ${table}${join}${where}${groupBy}${having}${order}${limit}`;
      break;

    case 'insert':
      const tableInsert = params.t;
      const data = params.d || {};
      const keysInsert = Object.keys(data).join(', ');
      const valuesInsert = Object.values(data).map(value => {
        if (value == null || value == undefined) {
          return 'null';
        } else if (typeof value === 'string') {
          return `'${value}'`;
        } else {
          return value;
        }
      }).join(', ');
      query = `INSERT INTO ${tableInsert} (${keysInsert}) VALUES (${valuesInsert})`;
      break;

    case 'update':
      const tableUpdate = params.t;
      const dataUpdate = params.d || {};
      const setData = Object.entries(dataUpdate).map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`).join(', ');
      const whereUpdate = params.w ? ` WHERE ${params.w}` : '';
      query = `UPDATE ${tableUpdate} SET ${setData}${whereUpdate}`;
      break;

    case 'delete':
      const tableDelete = params.t;
      const whereDelete = params.w ? ` WHERE ${params.w}` : '';
      query = `DELETE FROM ${tableDelete}${whereDelete}`;
      break;
  }

  return query;
}

function codeTSQL(frase) {
  let lista = [
    { buscar: 'select', cambiarPor: '-lectes' },
    { buscar: '*', cambiarPor: '-kuiki' },
    { buscar: 'from', cambiarPor: '-morf' },
    { buscar: 'inner', cambiarPor: '-nerin' },
    { buscar: 'join', cambiarPor: '-injo' },
    { buscar: 'update', cambiarPor: '-teupda' },
    { buscar: 'delete', cambiarPor: '-tedele' },
    { buscar: 'insert', cambiarPor: '-sertint' },
    { buscar: 'values', cambiarPor: '-luesva' },
    { buscar: 'set', cambiarPor: '-tes' },
    { buscar: 'into', cambiarPor: '-toin' },
    { buscar: 'where', cambiarPor: '-rewhe' },
    { buscar: 'as', cambiarPor: '-sa' },
    { buscar: 'on', cambiarPor: '-no' },
    { buscar: 'or', cambiarPor: '-ro' },
    { buscar: 'and', cambiarPor: '-ty' },
    { buscar: 'order', cambiarPor: '-enor' },
    { buscar: 'by', cambiarPor: '-yb' },
    { buscar: 'desc', cambiarPor: '-csed' },
    { buscar: 'asc', cambiarPor: '-cas' },
    { buscar: '<', cambiarPor: '-nim' },
    { buscar: '>', cambiarPor: '-xam' },
    { buscar: '<>', cambiarPor: '-nimxam' },
    { buscar: 'group', cambiarPor: '-puorg' },
    { buscar: 'having', cambiarPor: '-gnivah' },
    { buscar: 'left', cambiarPor: '-tfel' },
    { buscar: 'right', cambiarPor: '-thgir' },
    { buscar: 'limit', cambiarPor: '-timil' }
  ];


  frase = frase.replace(';', ' ');
  // Primero, reemplazamos todos los saltos de línea y tabulaciones por un espacio en blanco
  frase = frase.replace(/(\r|\t)/gm, ' ');

  // frase = frase.replace(/(\n)/gm, '\\n');
  frase = frase.replace(/('[^']*')|(\n)/gm, (match, p1) => {
    if (p1) {
      // Si es un texto entre comillas simples, reemplázalo por '\n'
      return p1.replace(/\n/g, '\\n');
    } else {
      // Si es un salto de línea, reemplázalo por un espacio
      return ' ';
    }
  });
  // Luego, reemplazamos cualquier secuencia de espacios en blanco por un solo espacio
  frase = frase.replace(/\s+/g, ' ');
  let arrayFrase = frase.split(' ');
  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join('tmn');
  return frase;
}

function decodeTSQL(frase) {
  let lista = [
    { cambiarPor: 'SELECT', buscar: '-lectes' },
    { cambiarPor: '*', buscar: '-kuiki' },
    { cambiarPor: 'FROM', buscar: '-morf' },
    { cambiarPor: 'INNER', buscar: '-nerin' },
    { cambiarPor: 'JOIN', buscar: '-injo' },
    { cambiarPor: 'UPDATE', buscar: '-teupda' },
    { cambiarPor: 'DELETE', buscar: '-tedele' },
    { cambiarPor: 'INSERT', buscar: '-sertint' },
    { cambiarPor: 'VALUES', buscar: '-luesva' },
    { cambiarPor: 'SET', buscar: '-tes' },
    { cambiarPor: 'INTO', buscar: '-toin' },
    { cambiarPor: 'WHERE', buscar: '-rewhe' },
    { cambiarPor: 'AS', buscar: '-sa' },
    { cambiarPor: 'ON', buscar: '-no' },
    { cambiarPor: 'OR', buscar: '-ro' },
    { cambiarPor: 'AND', buscar: '-ty' },
    { cambiarPor: 'ORDER', buscar: '-enor' },
    { cambiarPor: 'BY', buscar: '-yb' },
    { cambiarPor: 'ASC', buscar: '-cas' },
    { cambiarPor: 'DESC', buscar: '-csed' },
    { cambiarPor: '<', buscar: '-nim' },
    { cambiarPor: '>', buscar: '-xam' },
    { cambiarPor: '<>', buscar: '-nimxam' },
    { cambiarPor: 'group', buscar: '-puorg' },
    { cambiarPor: 'having', buscar: '-gnivah' },
    { cambiarPor: 'left', buscar: '-tfel' },
    { cambiarPor: 'right', buscar: '-thgir' },
    { cambiarPor: 'limit', buscar: '-timil' }
  ];

  let arrayFrase = frase.split('tmn');

  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join(' ');
  return frase;
}

function convertirClavesAMinusculas(objeto) {
  const resultado = {};
  for (const clave in objeto) {
    if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
      const claveMinuscula = clave.toLowerCase();
      resultado[claveMinuscula] = objeto[clave];
    }
  }
  return resultado;
}

function convertirFormatoFecha(objeto) {
  const resultado = {};

  for (const clave in objeto) {
    if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
      let valor = objeto[clave];

      if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(valor)) {
        // Si el valor es una cadena que coincide con el formato de fecha ISO, conviértelo
        let fechaFormateada = '';
        const fecha = new Date(valor);
        const horas = `${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}:${formatoDeCeros(fecha.getSeconds())}`;

        if (horas == '00:00:00') {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())}`;
        } else {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())} ${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}`;
        }

        resultado[clave] = fechaFormateada;
      } else {
        // Si no es una fecha, convierte la clave a minúsculas y copia el valor tal como está
        resultado[clave] = valor;
      }
    }
  }
  return resultado;
}

function convertirClavesAMinusculasYFormatoFecha(objeto) {
  const resultado = {};

  for (const clave in objeto) {
    if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
      let valor = objeto[clave];

      if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(valor)) {
        // Si el valor es una cadena que coincide con el formato de fecha ISO, conviértelo
        let fechaFormateada = '';
        const fecha = new Date(valor);
        const horas = `${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}:${formatoDeCeros(fecha.getSeconds())}`;

        if (horas == '00:00:00') {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())}`;
        } else {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())} ${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}:${formatoDeCeros(fecha.getSeconds())}`;
        }

        resultado[clave.toLowerCase()] = fechaFormateada;
      } else {
        // Si no es una fecha, convierte la clave a minúsculas y copia el valor tal como está
        resultado[clave.toLowerCase()] = valor;
      }
    }
  }
  return resultado;
}

function formatoDeCeros(valor) {
  return valor < 10 ? `0${valor}` : valor;
}

export function urlYoutube(urlvideo) {
  let desde, hasta;
  let cant = urlvideo.length;

  if (urlvideo.indexOf("watch?v=") > 0) {
    desde = urlvideo.indexOf("watch?v=") + 8;
    hasta = cant + 1;
    if (urlvideo.indexOf("&") > 0) {
      hasta = urlvideo.indexOf("&");
    }
  }

  if (urlvideo.indexOf("youtu.be/") > 0) {
    desde = 17;
    hasta = cant + 1;
    if (urlvideo.indexOf("&") > 0) {
      hasta = urlvideo.indexOf("&");
    }
  }

  return urlvideo.slice(desde, hasta);

}

export function defaultClass() {
  return {
    label: `block pl-1 text-sm font-medium text-neutral-900 dark:text-neutral-400`,
    navlink: `block text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent`,
    input: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    readonlyInput: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    select: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    btn: `h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none  `,
    btn2: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700  `,
    btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
    btnSimple: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
    tablet: `w-full text-sm text-left text-neutral-500 dark:text-neutral-400`,
    thead: `bg-white dark:bg-neutral-800 text-neutral-700  dark:text-neutral-400`,
    th: `px-4 py-3 select-none text-xs text-neutral-700 uppercase dark:text-neutral-400`,
    tr: `border-b border-neutral-200 dark:border-neutral-700`,
    td: `px-4 py-3 select-none`,
    tdclick: `px-4 py-3 select-none cursor-pointer font-semibold hover:text-green-400`,
    trh: `text-md font-semibold`,
    tdh: `px-4 py-2 select-none `,
    tdnumber: `px-4 py-4 text-right`,
    btnPrimary: `bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700`,
    btnDanger: `bg-red-700 text-white hover:bg-red-800 focus:ring-red-700`,
    btnSuccess: `bg-green-700 text-white hover:bg-green-800 focus:ring-green-700`,
    btnSecondary: `bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700`,
    btndark: `bg-white text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-100 dark:focus:ring-neutral-700`,
    navactive: `text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500`,
    inactive: `text-neutral-600`,
    btnAtras: `flex items-center ps-2 py-2 pe-4 gap-1 w-fit text-sm focus:outline-none font-medium text-neutral-500 rounded-md hover:text-neutral-600 focus:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800/50 border dark:border-neutral-700/50  bg-black/5 hover:bg-black/10 dark:bg-white/5`,
    btnBack: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-neutral-500 to-neutral-600 dark:from-neutral-700 dark:to-neutral-800 shadow-lg shadow-neutral-500/30 hover:shadow-neutral-500/50 dark:shadow-lg dark:shadow-neutral-700/80 border-b border-neutral-400 dark:border-neutral-600 active:translate-y-0.5  transition-all duration-100 scale-95 hover:scale-100 text-center `,
    btnSystem: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-neutral-500 shadow-lg hover:shadow-xl shadow-neutral-600/30 dark:shadow-neutral-300/30 dark:bg-neutral-600 active:translate-y-0.5 transition-all duration-100 active:bg-neutral-700 scale-95 hover:scale-100 text-center`,
    btnEmerald: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60 dark:from-emerald-600 dark:to-emerald-700 active:translate-y-0.5 transition-all duration-100  scale-95 hover:scale-100 dark:shadow-lg dark:shadow-emerald-800/80 text-center `,
    btnSky: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50  dark:from-sky-600 dark:to-sky-700 active:translate-y-0.5 transition-all duration-100 active:bg-sky-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center `,
    btnRed: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-600/30 hover:shadow-red-600/50  dark:from-red-600 dark:to-red-700 active:translate-y-0.5 transition-all duration-100 active:bg-red-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-red-800/80 text-center `,
    btnNeutral: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-neutral-500 shadow-lg hover:shadow-xl shadow-neutral-600/30 dark:shadow-neutral-300/30 dark:bg-neutral-600 active:translate-y-0.5 transition-all duration-100 active:bg-neutral-700 scale-95 hover:scale-100 text-center`,
    btnBlue: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-blue-500 shadow-lg hover:shadow-xl shadow-blue-600/30 dark:shadow-blue-300/30 dark:bg-blue-600 active:translate-y-0.5 transition-all duration-100 active:bg-blue-700 scale-95 hover:scale-100 text-center `,
    form: {
      divModal: `fixed top-0 flex left-0 right-0 z-50 h-full min-h-screen w-full bg-neutral-900/50 dark:bg-neutral-900/70  overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center bg-opacity-75 backdrop-filter backdrop-blur-sm`,
      btnCloseModal: `text-neutral-400 bg-transparent hover:bg-red-200 hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white`,
      divPadre: `relative container mx-auto max-w-screen-lg bg-transparent  shadow-none tmn-fadeIn`,
      modalContainer: `relative w-full max-w-3xl  bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg max-h-screen overflow-y-auto tmn-fadeIn transition-all duration-700 ease-in-out`,
      modalContainerFull: `relative w-full h-full max-h-screen overflow-y-auto bg-neutral-100 dark:bg-neutral-800 p-6 tmn-fadeIn transition-all duration-700 ease-in-out`,
      modalContainer2xl: `relative w-full max-w-2xl max-h-full bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg tmn-fadeIn transition-all duration-700 ease-in-out`,
      encabezado: `flex flex-col border-b rounded-t border-neutral-200 dark:border-neutral-700`,
      header: `flex flex-col items-start sm:flex-row sm:justify-between sm:items-center px-2 pb-3 rounded-t `,
      grid: `grid grid-cols-12 gap-2 py-6 px-2 h-full`,
      navInHeader: `flex w-full text-sm text-neutral-500 dark:text-neutral-500 border-b rounded-t border-neutral-200 dark:border-neutral-700 `,
      buttonNavInHeader: `inline-block gap-2 px-4 py-2 rounded-t-lg hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 `,
      footer: `flex items-center justify-between pt-4 gap-2 border-t border-neutral-200 dark:border-neutral-600`,
      inFooter: `flex items-center justify-end gap-2`,
      gridColumns: `col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`,
      titleContainer: `flex flex-col w-full`,
      buttonsContainer: `flex gap-1 w-full justify-end`,
      title: `text-lg font-medium text-left text-neutral-600 dark:text-white leading-none`,
      subtitle: `mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight`,
      observ: `mt-1 ml-1 text-sm font-normal italic text-neutral-500 dark:text-neutral-500 leading-tight`,
      label: `flex items-center gap-1 pl-1 text-sm font-semibold text-neutral-600 dark:text-neutral-400`,
      input: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
      textarea: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 whitespace-pre-line`,
      inputDisable: `bg-neutral-100 border border-neutral-300 text-neutral-400 text-sm rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-neutral-500 dark:focus:ring-yellow-700 dark:focus:border-yellow-700`,
      select: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
      headerColumn: `bg-transparent`,
      btn: `h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none  `,
      btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
      containerButtons: `flex items-center justify-start gap-2 `,
      submit: `!m-0 flex capitalize items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-sky-600 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50  hover:bg-sky-700 active:translate-y-0.5 transition-all duration-100 active:bg-sky-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center`,
      delete: `!m-0 flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-red-600 shadow-lg shadow-red-600/30 hover:shadow-red-600/50  hover:bg-red-700 active:translate-y-0.5 transition-all duration-100 active:bg-red-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-red-800/80 text-center`,
      darkBlue: `bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700`,
      darkRed: `bg-red-700 text-white hover:bg-red-800 focus:ring-red-700`,
      darkGreen: `bg-green-700 text-white hover:bg-green-800 focus:ring-green-700`,
      darkneutral: `bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700`,
      dark: `bg-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-700`,
      navactive: `text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500`,
      inactive: `text-neutral-600`,
    },
    table: {
      divPadre: `relative bg-transparent overflow-hidden tmn-fadeIn`,
      tableContainer: `overflow-x-auto rounded-lg border border-neutral-400/30 dark:border-neutral-700/50`,
      table: `w-full text-sm text-left text-neutral-500 dark:text-neutral-400`,
      header: `flex justify-between items-center w-full bg-transparent mb-6 gap-3`,
      titleContainer: `flex flex-col w-full`,
      buttonsContainer: `flex justify-end items-center gap-2 w-full`,
      title: `text-lg font-medium text-left text-neutral-600 dark:text-neutral-200 leading-none`,
      subtitle: `mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight`,
      btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
      thead: `text-xs border-b text-neutral-700 bg-neutral-100/70 border-neutral-200 uppercase dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-800`,
      tfoot: `bg-neutral-100/70 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400`,
      pagination: `flex flex-col sm:flex-row sm:justify-between items-center text-neutral-700 sm:px-4 pt-4 dark:text-neutral-400 `,
      paginationBtn: `bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white text-xs`,
      paginationBtnDisable: `bg-neutral-100 text-neutral-400  dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-600 text-xs`,
      th: `px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap`,
      tr: `border-t border-neutral-200 dark:border-neutral-700/70 `,
      trhover: `hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer`,
      td: `px-4 py-3 select-none whitespace-nowrap`,
      tdclick: `px-4 py-3 select-none cursor-pointer font-semibold hover:text-green-400`,
      trh: `text-md font-semibold whitespace-nowrap`,
      trtitle: `text-md font-semibold`,
      tdh: `px-4 py-2 select-none whitespace-nowrap`,
      tdnumber: `px-4 py-4 text-right`,
      rowNormal: `bg-neutral-50/50 dark:bg-neutral-800/80`,
      rowAlternative: `bg-neutral-50 dark:bg-neutral-800`,
    }
  }
}

export function prepararSQL(tabla, json, selectID = '') {
  let dataForSave = {};
  let elValor = '';
  let keyPrimary = '';
  let sql = '';
  let where = '';
  let tipoSQL = '';
  let camposIncompletos = '';
  let typeInput = '';
  let respuesta = {};
  let hayKey = false;

  if (tabla && json) {
    // let formValues = Object.values(json).map((field) => field.value);
    // alert(`Valores ingresados: ${formValues.join(", ")}`);
    let comprobation = Object.values(json).filter((field) => {
      if (field.required == true) {
        if (field.value === '' || field.value === null) {
          camposIncompletos += field.placeholder + ', ';
          return field.name;
        }
      }
    });

    if (!comprobation.length) {
      for (const key in json) {
        //console.log(key, json[key].value)
        if (json[key].noData == false) {
          if (json[key].key == 'PRI' || json[key].key == 'pri') {
            typeInput = json[key].type;
            hayKey = true;
            let valueKey = json[key].value;

            if (selectID != null) {
              console.log(selectID, valueKey)
              if (typeInput == 'integer' || typeInput == 'number') {
                if (json[key].value > 0) {
                  elValor = parseFloat(json[key].value);
                } else {
                  elValor = json[key].value;
                }
              } else {
                elValor = `${json[key].value}`;
              }

              if (elValor) {
                dataForSave[key] = elValor;
              }

              valueKey = selectID;

            }



            if (typeInput == 'integer' || typeInput == 'number') {
              where = `${key} = ${valueKey}`;
              keyPrimary = parseInt(valueKey);
            } else {
              where = `${key} = '${valueKey}'`;
              keyPrimary = valueKey;
            }

            tipoSQL = valueKey == 0 ? 'insert' : 'update';
          } else {
            typeInput = json[key].type;

            if (typeInput == 'integer' || typeInput == 'number') {
              if (json[key].value > 0) {
                if (json[key].value > 0) {
                  elValor = parseFloat(json[key].value);
                } else {
                  elValor = json[key].value;
                }
              } else {
                if (json[key].value == 0) {
                  elValor = 0;
                } else {
                  elValor = null;
                }
              }

            } else if (typeInput == 'currency') {
              if (json[key].value !== '') {
                elValor = parseFloat(json[key].value);
              } else {
                if (json[key].value == 0) {
                  elValor = 0;
                } else {
                  elValor = null;
                }
              }
            } else if (typeInput == 'select') {
              if (json[key].value !== '') {
                elValor = json[key].value;
              } else {
                elValor = '';
              }
            } else if (typeInput == 'datetime-local' || typeInput == 'date') {
              if (json[key].value !== '') {
                elValor = json[key].value;
              } else {
                elValor = null;
              }
            } else if (json[key].value == null) {
              elValor = null;
            } else {
              elValor = `${json[key].value}`;
            }
            dataForSave[key] = elValor;
          }
        }
      }

      //console.log('Primer Paso',dataForSave);
      informe.primero = dataForSave;
      sql = createQuerySQL(tipoSQL, {
        t: tabla,
        w: where,
        d: dataForSave
      });

      //console.log('Segundo Paso', sql);
      informe.segundo = sql
      respuesta = {
        status: 1,
        tipo: tipoSQL,
        keyPrimary: keyPrimary,
        sql: sql,
        camposIncompletos: camposIncompletos
      };
    } else {
      respuesta = {
        status: 0,
        tipo: '',
        keyPrimary: keyPrimary,
        sql: '',
        camposIncompletos: camposIncompletos
      };
    }
  }
  return respuesta;
}

export async function dbSelect(type, sql) {
  let datos = {
    tipo: type.charAt(0),
    tsql: codeTSQL(sql)
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/tsql.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/tsql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();

    const newResult = result.map((obj) => {
      // return convertirClavesAMinusculas(obj)
      return convertirClavesAMinusculasYFormatoFecha(obj)
    })


    return newResult;

  } catch (error) {
    console.log(error)
    console.log(informe)
    console.log(datos)
    const err = [{ resp: 'error', msgError: 'Error en la conexión a la base de datos.' }];
    return err;
  }
}

export async function login(user, password) {
  let datos = {
    user, password
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/login.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();
    return result;
  } catch (error) {
    const err = [{ resp: 'error', msgError: 'Error al consultar datos!' }];
    return err;
  }
}

export async function structure(type, name) {
  let datos = {
    type,
    name
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/structure.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/tmnstruc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();
    return result;
  } catch (error) {
    const err = [{ resp: 'error', msgError: 'Error al consultar datos!', err: error }];
    return err;
  }
}

export async function runCode(input) {
  let opcion = '';
  let data = '';
  const codwords = ['-sl', '-st', '-in', '-up', '-dl'];

  const lista = [
    { str: 'select', cod: '-sl' },
    { str: 'select * from', cod: '-st' },
    { str: '*', cod: '-kk' },
    { str: 'from', cod: '-fr' },
    { str: 'join', cod: '-jn' },
    { str: 'inner join', cod: '-ij' },
    { str: 'left join', cod: '-il' },
    { str: 'right join', cod: '-ir' },
    { str: 'left', cod: '-lf' },
    { str: 'right', cod: '-rg' },
    { str: 'update', cod: '-up' },
    { str: 'delete', cod: '-dl' },
    { str: 'delete from', cod: '-df' },
    { str: 'insert into', cod: '-in' },
    { str: 'values', cod: '-va' },
    { str: 'set', cod: '-se' },
    { str: 'where', cod: '-wr' },
    { str: 'as', cod: '->' },
    { str: 'or', cod: '|' },
    { str: 'and', cod: '&' },
    { str: 'order by', cod: '-ob' },
    { str: 'order', cod: '-od' },
    { str: 'by', cod: '-yy' },
    { str: 'desc', cod: '-ds' },
    { str: 'asc', cod: '-as' },
    { str: '<', cod: '-me' },
    { str: '>', cod: '-ma' },
    { str: '<>', cod: '-mm' },
    { str: 'group by', cod: '-gb' },
    { str: 'group', cod: '-gr' },
    { str: 'having', cod: '-hv' },
    { str: 'limit', cod: '-lt' },
    { str: 'like', cod: '-lk' },
    { str: ' ', cod: '-__' }
  ];

  let inicharter = input.toLowerCase();

  for (let keyword of codwords) {
    if (inicharter.startsWith(keyword)) {
      lista.forEach(val => {
        if (val.cod == keyword) {
          opcion = val.str;
        }
      })
    }
  }

  for (let item of lista) {
    let code = item.cod;
    let str = item.str;
    input = input.split(code).join(str);
  }

  input = input.replace(/\s+-/g, '-').replace(/-\s+/g, '-');

  if (opcion) {
    data = await dbSelect(opcion, input);
    return data;
  } else {
    console.error('No se reconoce la estructura!')
    return [{ resp: 'error', msgError: 'No se reconoce la estructura!' }]
  }

}

export function nameServer() {
  return `${TYPE_SERVER} - ${SERVER}`
}

export function inServer(folder) {
  if (folder) {
    return `${SERVER}/${folder}`
  } else {
    return `${SERVER}`
  }
}

export function formatNumberArray(str, dec = 2) {
  if (!str) {
    str = '0.00t';
  } else {
    str = str + 't';
  }

  let negativo = str.startsWith('-', 0);
  let numero = str.replace(/[^0-9.,]/g, '');
  let arrayNumero = numero.replace(/[.,]/g, ',').split(',');
  let ultimoValor = arrayNumero.length - 1;
  let numeroReal = numero;
  let numeroFinal = '';
  let resultado = [];
  let parteEntera = '';
  let parteDecimal = '';

  arrayNumero.forEach((parte, index) => {
    if (index == ultimoValor) {
      numeroFinal += `${parte}`;
      parteDecimal += `${parte}`;
    } else if (index == ultimoValor - 1) {
      numeroFinal += `${parte}.`;
      parteEntera += `${parte}`;
    } else {
      numeroFinal += `${parte}`;
      parteEntera += `${parte}`;
    }
  });


  if (dec > 0) {
    numeroFinal = parseFloat(numeroFinal).toFixed(dec);
  } else {
    numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
  }

  if (negativo) {
    numeroFinal = `-${numeroFinal}`;
    numeroReal = `-${numero}`;
  }

  if (numeroFinal == 'NaN') numeroFinal = '0';

  resultado[0] = numeroFinal;
  resultado[1] = new Intl.NumberFormat('en-EN', { minimumFractionDigits: dec }).format(
    parseFloat(numeroFinal)
  );
  resultado[2] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec }).format(
    parseFloat(numeroFinal)
  );

  if (arrayNumero.length > 1) {
    resultado[3] = parteEntera;
    resultado[4] = parteDecimal;
  } else {
    resultado[3] = parteDecimal;
    resultado[4] = '';
  }
  resultado[5] = numeroReal;


  return resultado;
}

export function formatNumber(str, options = { dec: 2, leng: 'es', symb: '', type: 'number' }) {
  if (!str) {
    str = '0.00t';
  } else {
    str = str + 't';
  }

  if (!options.dec) options.dec = 2;
  if (!options.leng) options.leng = 'es';
  if (!options.symb) options.symb = '';
  if (!options.cero) options.cero = '';
  if (!options.type) options.type = 'currency';

  let negativo = str.startsWith('-', 0);
  let numero = str.replace(/[^0-9.,]/g, '');
  let xNumero = numero.replace(/[.,]/g, ',').split(',');
  let ultimoValor = xNumero.length - 1;
  let numeroReal = numero;
  let numeroFinal = '';
  let resultado = [];
  let parteEntera = '';
  let parteDecimal = '';

  xNumero.forEach((parte, index) => {
    if (index == ultimoValor) {
      numeroFinal += `${parte}`;
      parteDecimal += `${parte}`;
    } else if (index == ultimoValor - 1) {
      numeroFinal += `${parte}.`;
      parteEntera += `${parte}`;
    } else {
      numeroFinal += `${parte}`;
      parteEntera += `${parte}`;
    }
  });

  if (numeroFinal == 'NaN') numeroFinal = '0';
  if (numeroReal == 'NaN') numeroReal = '';

  if (options.dec > 0) {
    numeroFinal = parseFloat(numeroFinal).toFixed(options.dec);
  } else {
    numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
  }

  if (options.leng == 'en') {
    resultado = numeroFinal;
  } else {
    resultado = new Intl.NumberFormat('de-DE', { minimumFractionDigits: options.dec }).format(
      parseFloat(numeroFinal)
    );
  }

  if (options.cero != '') {
    if (resultado == '0,00' || resultado == '0.00' || resultado == '0') {
      resultado = options.cero;
    }
  }

  if (options.symb != '') {
    resultado = `${options.symb} ${resultado}`;
  }

  if (negativo) {
    resultado = `-${resultado}`
    numeroReal = `-${numero}`;
  }

  if (options.type == 'currency') {
    return resultado;
  } else if (options.type == 'number') {
    return numeroReal;
  } else if (options.type == 'integer') {
    return parteEntera;
  } else if (options.type == 'decimal') {
    return parteDecimal;
  } else {
    return numeroReal;
  }


}

export function formatDate(valor = null, separador = '-') {
  let myDate;
  let sep = separador || '-';
  if (valor == null) {
    valor = new Date();
    myDate = valor;
  }

  let exp = /^\d{2,4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}$/gm;
  let exp2 = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/gm;
  const arrayDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const arrayDia = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const arrayMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  const arrayMes = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ];

  if (typeof valor == 'string') {
    if (valor.match(exp)) {
      myDate = new Date(valor);
    } else if (valor.match(exp2)) {
      myDate = new Date(`${valor} 00:00:00`);
    } else {
      return 'El valor es incorrecto';
    }
  }



  if (typeof valor == 'object') {
    myDate = valor;
  }

  if (typeof valor !== 'string' && typeof valor !== 'object') {
    return 'parametro incorrecto';
  }

  let anio = myDate.getFullYear();
  let mes = myDate.getMonth() + 1;
  let dia = myDate.getDate();
  let dsem = myDate.getDay();
  let hora = myDate.getHours();
  let minutos = myDate.getMinutes();
  let segundos = myDate.getSeconds();

  mes = mes < 10 ? '0' + mes : mes;
  dia = dia < 10 ? '0' + dia : dia;
  hora = hora < 10 ? '0' + hora : hora;
  minutos = minutos < 10 ? '0' + minutos : minutos;
  segundos = segundos < 10 ? '0' + segundos : segundos;

  let myObject = {
    fecha: '' + anio + '-' + mes + '-' + dia,
    fechaEs: '' + dia + sep + mes + sep + anio,
    anio: anio,
    mes: mes,
    mesCorto: arrayMes[myDate.getMonth()],
    mesLargo: arrayMeses[myDate.getMonth()],
    dia: dia,
    diaSem: dsem,
    anioMes: anio + sep + mes,
    mesDia: mes + sep + dia,
    mesAnio: arrayMeses[myDate.getMonth()] + sep + anio,
    diaCorto: arrayDia[dsem],
    diaLargo: arrayDias[dsem],
    fechaCarta: arrayDias[dsem] + ' ' + myDate.getDate() + ' de ' + arrayMeses[myDate.getMonth()] + ' de ' + anio,
    fechaHoraCarta: arrayDias[dsem] + ' ' + myDate.getDate() + ' de ' + arrayMeses[myDate.getMonth()] + ' de ' + anio + ' ' + hora + ':' +
      minutos,
    fechaTonic:
      '' + myDate.getDate() + sep + arrayMes[myDate.getMonth()] + sep + anio,
    fechaHoraEs:
      '' +
      dia +
      sep +
      mes +
      sep +
      anio +
      ' ' +
      hora +
      ':' +
      minutos +
      ':' +
      segundos,
    fechaHoraLocal: '' + anio + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos,
    fechaHora:
      '' +
      anio +
      '-' +
      mes +
      '-' +
      dia +
      ' ' +
      hora +
      ':' +
      minutos +
      ':' +
      segundos,
    fechaHoraT: '' + anio + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos,
    horaLarga: hora + ':' + minutos + ':' + segundos,
    horaCorta: hora + ':' + minutos,
    hora: hora,
    minutos: minutos,
    segundos: segundos,
    serial: '' + (anio - 2000) + '' + mes + '' + dia,
    etiqueta: '' + hora + minutos + segundos
  };

  return myObject;
}

export async function initKeyData(table, key, value) {
  let objData = {};
  let momo = await runCode(`-st ${table}`).then(data => {
    data.forEach(row => {
      objData[row[key]] = row[value];
    })
    return objData;
  })
  return momo
}

export function pesos(numero, decimales, signo = '$') {
  let numeroString = formatNumber(numero, { dec: decimales, symb: signo, type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function currency(numero) {
  let numeroString = formatNumber(numero, { dec: 2, type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function numberEn(numero) {
  let numeroString = formatNumber(numero, { dec: 2, leng: 'en', type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function padLeft(str, length = 4, character = '0') {
  while (str.length < length) {
    str = character + str;
  }
  return str;
}

export function padRight(str, length = 4, character = '0') {
  while (str.length < length) {
    str = str + character;
  }
  return str;
}

export async function urlExists(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function handleStructure(structure) {
  const groupType = {};
  const primaryKey = {};

  if (structure.length > 0) {
    structure.forEach(val => {
      let name = val.COLUMN_NAME.toLowerCase()
      groupType[name] = typeToType(val.DATA_TYPE);
      primaryKey[name] = val.COLUMN_KEY;
    })
  } 

  return { groupType, primaryKey };
}

export function typeToType(inType = 'text') {
  let outType;
  if (inType == 'int') outType = 'number';
  if (inType == 'tinyint') outType = 'number';
  if (inType == 'double') outType = 'number';
  if (inType == 'char') outType = 'text';
  if (inType == 'varchar') outType = 'text';
  if (inType == 'datetime') outType = 'datetime-local';
  if (inType == 'timestamp') outType = 'datetime-local';
  if (inType == 'date') outType = 'date';
  if (inType == 'time') outType = 'time';
  if (inType == 'decimal') outType = 'currency';
  if (inType == 'text') outType = 'text';
  if (inType == 'longtext') outType = 'text';

  if (!outType) {
    console.error(`inType ${inType} no definido!`)
    outType = 'text'
  }

  return outType
}

export async function setStructure(table) {
  let struc = await structure('t', table);
    if (!struc[0].resp) {
      const newStruc = []
      struc.forEach(data => {
        data.table = table;
        data.COLUMN_NAME = data.COLUMN_NAME.toLowerCase()
        newStruc.push(data);
      })
      return newStruc;
    } else {
      console.error(struc[0].msgError, struc[0].err)
      return false
    }
}

export async function dataTableRunCode(codeSQL, table, keyPrimary = ''){
  let objResult = {
    response: true,
    data : [],
    struc: {},
    error: ''
  }
  try {
    const value = await runCode(codeSQL);
    objResult.data = value;

    if(table){
      const tableStructure = await setStructure(table, keyPrimary);
      objResult.struc = handleStructure(tableStructure);
    }
 
    return objResult;
    
  } catch (err) {
    objResult.response = false;
    objResult.error = err.message || 'Error al traer datos';
    return objResult;
  } 
}

export function originServer() {
  return window.location.origin;
}

export class Tamnora {
  constructor(config = {}) {
    this.tmn = '';
    this.data = this.createReactiveProxy(config.data);
    this._componentHTML = config.componentHTML || {};
    this.defaultData = {};
    this.class = config.styleClasses || defaultClass();
    this.templates = {};
    this.cantForms = 0;
    this.objects = {};
    this.cantTables = 0;
    this.theme = '';
    this.themeColorDark = '#262626';
    this.themeColorLight = '#f5f5f5';
    this.componentDirectory = config.componentDirectory || '../components';
    this.state = this.loadStateFromLocalStorage();
    this.onMountCallback = null;
    // this.darkMode(config.darkMode ?? false);

    // Agregar código de manejo de navegación en la carga de la página
    this.handleNavigationOnLoad();

    this.functions = {
      openSelect: (name) => {
        const self = this;
        document.getElementById(`${name}_options`).classList.toggle('hidden');
        document.getElementById(`${name}_cerrado`).classList.toggle('hidden');
        document.getElementById(`${name}_abierto`).classList.toggle('hidden');

        document.querySelectorAll(`#${name}_options li`).forEach(function (li) {
          li.addEventListener('click', function (e) {
            self.data[`${name}_selected`] = e.target.innerText;
          });
        });

      },
      closeModal: (name) => {
        const btnDelete = this.objects[name].formElement.querySelector(`[data-formclick="delete,${name}"]`);
        const modal = document.querySelector(`#${this.objects[name].name}`);
        if (btnDelete) btnDelete.innerHTML = this.objects[name].formOptions.delete;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        this.objects[name].numberAlert = 0;
        if (this.functions[`onCloseModal_${name}`]) {
          this.functions[`onCloseModal_${name}`]();
        }
      },
      openModal: (name) => {
        const btnDelete = this.objects[name].formElement.querySelector(`[data-formclick="delete,${name}"]`);
        const modal = document.querySelector(`#${this.objects[name].name}`);
        if (btnDelete) btnDelete.innerHTML = this.objects[name].formOptions.delete;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        this.objects[name].numberAlert = 0;
        if (this.functions[`onOpenModal_${name}`]) {
          this.functions[`onCOpenodal_${name}`]();
        }
      },
      onMount: (name) => { this.objects[name].onMount() },
      submit: async (event, name) => {
        let resultEvalute = true;
        //console.log(name, this.data[name])
        this.setDataFromModel(this.data[name], name);
        for (const fieldName in this.objects[name].midata) {
          if (this.objects[name].midata[fieldName].validate) {
            let value = this.objects[name].midata[fieldName].value;
            let campo = this.objects[name].midata[fieldName].name;
            let validate = this.objects[name].midata[fieldName].validate;

            if (!eval(validate)) {
              resultEvalute = false;
              const input = globalThis.document.getElementById(`${this.objects[name].name}_${fieldName}`);
              input.focus();
              input.select();
              console.log(`El campo ${campo} no pasa la validación`)
              return false;
            }
          }
        }

        if (resultEvalute) {
          let defaultTitle = event.submitter.innerHTML;
          event.submitter.disabled = true;
          event.submitter.innerHTML = `
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-blue-600 dark:text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Procesando...
            `

          // Define una promesa dentro del evento submit
          const promesa = new Promise((resolve, reject) => {
            const datt = this.objects[name].name;
            // this.setDataFromModel(this.data[datt]);
            const paraSQL = this.getDataAll(name);
            // console.log('paraSQL', paraSQL)
            const send = prepararSQL(this.objects[name].table, paraSQL, this.objects[name].id);
            const validation = this.validations(name);
            // console.log('Voy por acá')
            // console.log(send.tipo, send.sql)

            if (validation) {
              if (send.status == 1) {
                dbSelect(send.tipo, send.sql).then(val => {
                  if (val[0].resp == 1) {
                    resolve(val[0]);
                  } else {
                    reject(val[0]);
                  }
                })
              } else {
                reject('Algo falta por aquí!')
              }
            } else {
              reject('No paso la validación!')
            }

          });

          // Maneja la promesa
          promesa
            .then((respuesta) => {
              event.submitter.innerHTML = `${defaultTitle}`;
              event.submitter.disabled = false;


              if (this.functions[`onSubmit_${name}`]) {
                this.functions[`onSubmit_${name}`](respuesta);
              }

              if (this.objects[name].resetOnSubmit) {
                this.resetValues(name);
              }

              if (this.objects[name].nameModal) {
                this.functions.closeModal(name);
              }
            })
            .catch((error) => {
              this.objects[name].onSubmit(error);
              console.error("Error al enviar el formulario:", error);
              event.submitter.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg> Error al Guardar !
              
              `;
            });
        }

      },
      delete: async (name) => {
        const isThis = this.objects[name];
        let sql, reference, val, key;
        const datt = isThis.name;
        const btnDelete = isThis.formElement.querySelector(`[data-formclick="delete,${name}"]`);

        console.log(isThis);

        if (isThis.key != '') {
          key = isThis.key;
          if (isThis.id) {
            val = isThis.id;
          } else {
            val = isThis.midata[isThis.key].value;
          }
          sql = `DELETE FROM ${isThis.table} WHERE ${isThis.key} = ${val}`;
          reference = `<span class="font-bold ml-2">${isThis.midata[isThis.key].name}  ${val}</span>`;
        } else {
          isThis.structure.forEach(value => {
            console.log(value)
            if (value.COLUMN_KEY == 'PRI') {
              key = value.COLUMN_NAME;
              val = isThis.getValue(`${datt}!${value.COLUMN_NAME}`);
              sql = `DELETE FROM ${isThis.table} WHERE ${value.COLUMN_NAME} = ${val}`;
              reference = `<span class="font-bold ml-2">${value.COLUMN_NAME}  ${val}</span>`;
            }
          })

        }

        if (sql && val) {
          if (isThis.numberAlert > 0) {
            let defaultTitle = btnDelete.innerHTML;
            btnDelete.disabled = true;
            btnDelete.innerHTML = `
                  <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              Eliminando...
                  `

            // Define una promesa dentro del evento submit
            const promesa = new Promise((resolve, reject) => {
              dbSelect('d', sql).then(val => {
                if (val[0].resp == 1) {
                  resolve(val[0]);
                } else {
                  reject(val[0]);
                }
              })

            });

            // Maneja la promesa
            promesa
              .then((respuesta) => {
                btnDelete.innerHTML = isThis.formOptions.delete;
                btnDelete.disabled = false;
                isThis.numberAlert = 0;

                if (this.objects[name].nameModal) {
                  this.functions.closeModal(name);
                }

                if (this.functions[`onDelete_${name}`]) {
                  this.functions[`onDelete_${name}`](respuesta);
                }

                if (this.objects[name].resetOnSubmit) {
                  this.resetValues(name);
                }
              })
              .catch((error) => {
                console.error("Error al enviar el formulario:", error);
              });


          } else {
            isThis.numberAlert = 1;
            btnDelete.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-4 h-4 mr-2 text-white">
    <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
  </svg>  Confirma ELIMINAR ${reference}
                   `
          }

        } else {
          console.error(`NO se puede ELIMINAR ${key} con valor ${val} NULL`)
        }

      },
      reload: () => { console.log },
      textSearchGo: (name) => {
        this.objects[name].from = 1;
        this.objects[name].searchValue = this.getValue(`${name}_textSearch`);
        this.updateTable(name);
      }
    };

    window.addEventListener('popstate', () => {
      this.handleNavigation();
    });

    this.init();
  }

  init() {
    this.initCss();
    const app = document.getElementById('tmn')
    const body = document.querySelector("body");

    if (!app) {
      const newDiv = document.createElement("div");
      const classNames = 'container mx-auto tmn-fadeIn p-5 transition-bg duration-500 flex flex-col gap-3 absolute top-0'
      newDiv.id = "tmn";
      classNames.split(" ").forEach(className => {
        newDiv.classList.add(className);
      });
      body.appendChild(newDiv);
      this.tmn = document.getElementById('tmn');
    } else {
      this.tmn = document.getElementById('tmn');
    }

    this.initialize();
  }

  initCss() {
    const element = document.getElementById('initcss');
    let existe = false;

    if (element) {
      existe = true;
    } else {
      existe = false;
    }

    if (!existe) {
      const styleTag = document.createElement('style');
      styleTag.id = "initcss";

      // Agregar estilos al elemento
      styleTag.textContent = `
          :root {
            --emerald-800: #065f46;
            --emerald-700: #047857;
            --neutral-900: #171717;
            --neutral-800: #262626;
            --neutral-100: #f5f5f5;
            --neutral-200: #e5e5e5;
            --neutral-300: #D4D4D4;
            --sky-700: #0369A1;
            --sky-500: #0ea5e9;
          }
          
          /* Estiliza la barra de desplazamiento vertical */
          ::-webkit-scrollbar {
            background: var(--neutral-100);
            width: 16px;
            height: 14px;
          }
          
          ::-webkit-scrollbar-track {
            background: var(--neutral-100);
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: var(--neutral-200);
            border-radius: 20px;
            border: 4px solid var(--neutral-100);
          }
          
          /* Estilo de la barra de desplazamiento en modo oscuro */
          html.dark ::-webkit-scrollbar {
            background: var(--neutral-900);
            width: 16px;
            height: 14px;
          }
          
          html.dark ::-webkit-scrollbar-track {
            background: var(--neutral-900); /* Cambia el color de fondo en modo oscuro */
          }
          
          html.dark ::-webkit-scrollbar-thumb {
            background-color: var(--neutral-800); /* Cambia el color del pulgar en modo oscuro */
            border: 4px solid var(--neutral-900); /* Cambia el color del borde en modo oscuro */
          }
          
          @-webkit-keyframes tmn-fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes tmn-fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          .tmn-fadeIn {
            -webkit-animation-name: tmn-fadeIn;
            animation-name: tmn-fadeIn;
            -webkit-animation-duration: 0.7s;
            animation-duration: 0.7s;
          }

          @-webkit-keyframes tmn-fadeInDown {
            0% {
              opacity: 0;
              -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
            }
            to {
              opacity: 1;
              -webkit-transform: translateY(0);
              transform: translateY(0);
            }
          }
          
          @keyframes tmn-fadeInDown {
            0% {
              opacity: 0;
              -webkit-transform: translateY(-100%);
              transform: translateY(-100%);
            }
            to {
              opacity: 1;
              -webkit-transform: translateY(0);
              transform: translateY(0);
            }
          }
          
          .tmn-fadeInDown {
            -webkit-animation-name: tmn-fadeInDown;
            animation-name: tmn-fadeInDown;
            -webkit-animation-duration: 0.5s;
            animation-duration: 0.5s;
          }

          @keyframes flashTableRow {
            0%, 50%, 100% {
              opacity: 1;
            }
            25%, 75% {
              opacity: 0.2;
            }
          }
          
          .flashTableRow {
            animation: flashTableRow 1s ease-in-out; /* Duración y función de temporización */
          }

          @-webkit-keyframes tmn-fadeOut {
            0% { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes tmn-fadeOut {
            0% { opacity: 1; }
            to { opacity: 0; }
          }
          .tmn-fadeOut {
            -webkit-animation-name: tmn-fadeOut;
            animation-name: tmn-fadeOut;
            -webkit-animation-duration: 0.7s;
            animation-duration: 0.7s;
          }
          
          `;

      // Agregar el elemento <style> al <head>
      document.head.appendChild(styleTag);
    }
  }

  createDiv(id, classNames) {
    const tmnDiv = document.getElementById("tmn");
    const newDiv = document.createElement("div");
    newDiv.id = id;

    if (!document.getElementById(id)) {
      classNames.split(" ").forEach(className => {
        newDiv.classList.add(className);
      });

      tmnDiv.appendChild(newDiv);
    }


  }

  async fetchData(url, data = null, method = 'GET', serverName = null) {
    try {
      let allURL = serverName ? `${server}/${url}` : `${SERVER}/${url}`;

      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data !== null) {
        requestOptions.body = JSON.stringify(data);
      }

      const response = await fetch(allURL, requestOptions);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  createReactiveProxy(data) {
    const recursiveHandler = {
      get: (target, prop) => {
        recursiveHandler.val = prop;
        const value = target[prop];
        if (typeof value === 'object' && value !== null && value !== undefined) {
          return new Proxy(value, recursiveHandler); 
        }
        return value;
      },
      set: (target, prop, value) => {
        target[prop] = value;
        if (recursiveHandler.val == 'constructor') {
          this.updateElementsWithDataValue(prop, value);
        } else {
          this.updateElementsWithDataValue(`${recursiveHandler.val}!${prop}`, value);
        }
        return true;
      },
      val: '',
    };

    if (!data) {
      data = {};
    }

    return new Proxy(data, recursiveHandler);
  }

  getClass(name) {
    return this.class[name];
  }

  setClass(name, groupClass) {
    this.class[name] = groupClass
  }

  getClassAll() {
    return this.class;
  }

  getComponentHTML(name) {
    if (name) {
      return this._componentHTML[name];
    } else {
      return this._componentHTML;

    }
  }

  setComponentHTML(name, html) {
    if (name && html) {
      this._componentHTML[name] = html;
      this.bindComponents();
    } else {
      console.error('Error en componente')
    }
  }

  initialize() {
    document.addEventListener("DOMContentLoaded", () => {
    this.bindElementsWithDataValues();
    this.bindClickEvents();
    this.bindComponents();
    this.applyStyleClassesNavActive()
    this.bindSubmitEvents();
    this.bindChangeEvents();
    this.darkMode(false);
    this.listenerMessage();
    })
  }

  setValue(name, datos, menos) {
    const setNestedValue = (obj, path, value) => {
      const props = path.split('!');
      let nestedObj = obj;
      for (let i = 0; i < props.length - 1; i++) {
        const prop = props[i];
        if (!(prop in nestedObj)) {
          nestedObj[prop] = {};
        }
        nestedObj = nestedObj[prop];
      }
      nestedObj[props[props.length - 1]] = value;
    };

    if (Array.isArray(datos)) {
      this.data[name] = [...datos];
    } else if (typeof datos === 'object' && datos !== null) {
      if (menos) {
        Object.entries(datos).forEach(([key, value]) => {
          if (key !== menos) {
            setNestedValue(this.data, `${name}!${key}`, value);
            this.updateElementsWithDataValue(`${name}!${key}`, value);
          }
        });
      } else {
        Object.entries(datos).forEach(([key, value]) => {
          setNestedValue(this.data, `${name}!${key}`, value);
          this.updateElementsWithDataValue(`${name}!${key}`, value);
        });
      }
    } else {
      setNestedValue(this.data, name, datos);
      this.updateElementsWithDataValue(name, datos);
    }
  }

  set(name, datos, menos){
    this.setValue(name, datos, menos)
  }

  getValue(camino) {
    const propiedades = camino.split('!');
    let valorActual;

    for (let propiedad of propiedades) {
      if (this.data.hasOwnProperty(propiedad)) {
        if (typeof this.data[propiedad] == 'object') {
          valorActual = new Object(this.data[propiedad]);
        } else {
          valorActual = this.data[propiedad];
        }
      } else {
        return undefined; 
      }
    }
    return valorActual;
  }

  get(camino) {
    return this.getValue(camino)
  }

  getValueFormat(camino, format) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
        if (format == 'pesos') {
          valorActual = formatNumber(valorActual, { symb: '$', type: 'currency' })
        }
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  existValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;
    let existe = false;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        existe = true;
      }
    }
    return existe;
  }

  getDefaultData(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }

    return valorActual;
  }

  
  setValueRoute(camino, nuevoValor, name = '') {
    console.log(camino, nuevoValor)
    const propiedades = camino.split('!');
    let valorActual = name ? this.objects[name].data : this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
    this.updateElementsWithDataValue(camino, nuevoValor, name);
  }

  setValueRouteUni(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }


    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;

  }

  isUrlYoutube(url) {
    if (url.indexOf("embed") < 0) {
      let xvideo = video.value;

      xvideo = 'https://www.youtube.com/embed/' + urlYoutube(xvideo);

      //xvideo = xvideo.replace('https://youtu.be', 'https://www.youtube.com/embed');
      //xvideo = xvideo.replace('watch?v=', 'embed/');
      return xvideo;
    } else {
      return url

    }
  }

  setDefaultData(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];

      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
  }

  pushValue(name, obj, format = false) {
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanValueOld(obj, format = false) {
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    } else {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            this.data[obj][key] = "";
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
    }
  }

  cleanValue(camino) {
    const cleanNestedValue = (obj, path) => {
      const props = path.split('!');
      let nestedObj = obj;
      for (let i = 0; i < props.length - 1; i++) {
        const prop = props[i];
        if (!(prop in nestedObj)) {
          return; 
        }
        nestedObj = nestedObj[prop];
      }
      const lastProp = props[props.length - 1];
      if (lastProp in nestedObj) {
        nestedObj[lastProp] = '';
        this.updateElementsWithDataValue(path, '');
      }
    };
    cleanNestedValue(this.data, camino);
  }

  resetValues(name) {
    const thisObjData = this.objects[name].midata;
    const thisData = this.data[name];
    const thisDataDefault = this.data[`${name}_clean`];

    for (const fieldName in thisObjData) {
      const introDate = thisObjData[fieldName].introDate;
      let value = thisDataDefault[fieldName];

      if (introDate == true) {
        let myDate = new Date();
        let days = thisObjData[fieldName]['setDate'];
        let typeInput = thisObjData[fieldName]['type'];
        if (days > 0) {
          myDate.setDate(myDate.getDate() + days);
        } else if (days < 0) {
          myDate.setDate(myDate.getDate() - days);
        }

        if (typeInput == 'datetime-local') {
          thisObjData[fieldName].value = formatDate(myDate).fechaHora;
          thisData[fieldName] = formatDate(myDate).fechaHora;
        } else if (typeInput == 'date') {
          thisObjData[fieldName].value = formatDate(myDate).fecha;
          thisData[fieldName] = formatDate(myDate).fecha;
        } else if (typeInput == 'time') {
          thisObjData[fieldName].value = formatDate(myDate).horaLarga;
          thisData[fieldName] = formatDate(myDate).horaLarga;
        }

      } else {
        console.log(fieldName, value)
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          thisData[fieldName] = parseFloat(value);
          thisObjData[fieldName].value = parseFloat(value);
        } else {
          thisData[fieldName] = value;
          thisObjData[fieldName].value = value;
        }
      }

    }

  }

  getFunction() {
    console.log(this.functions);
  }

  setFunction(name, fn) {
    this.functions[name] = fn
  }

  applyStyles(element, classes) {
    element.className = classes.input;
    const labelElement = element.parentElement.querySelector('label');
    const messageElement = element.parentElement.querySelector('.mt-2');

    if (labelElement) {
      labelElement.className = classes.label;
    }

    if (messageElement) {
      messageElement.className = classes.message;
      const messageSpan = messageElement.querySelector('span');
      if (messageSpan) {
        messageSpan.className = classes.messageText;
        messageSpan.textContent = classes.messageContent;
      }
    }
  }

  createInputSearch(id, config, callback) {
    const container = document.getElementById(id);
    const idInput = `inputSearch_${id}`;
    const arrayObject = config.arrayObject;
    const buscarEnKey = config.buscarEnKey;
    const name = config.name ?? '';
    const placeholder = config.placeholder ?? '...';
    const sarta = config.sarta ?? false;



    if (!container) {
      console.error(`El elemento con id ${id} no fue encontrado.`);
      return;
    }

    const successClasses = {
      label: 'block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-500',
      input: 'bg-white border border-neutral-300 text-sky-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-sky-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 font-semibold',
      message: 'mt-2 text-sm text-green-600 dark:text-green-500',
      messageText: 'font-medium',
      messageContent: ''
    };

    const errorClasses = {
      label: 'block mb-2 text-sm font-medium text-red-600 dark:text-red-500',
      input: 'bg-white border border-neutral-300 text-red-900 text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-red-700 dark:focus:border-red-700 font-semibold',
      message: 'mt-2 text-sm text-red-600 dark:text-red-500',
      messageText: 'font-medium',
      messageContent: 'Error, valor no encontrado!'
    };

    const inputHtml = `
      <div class="mb-6">
        <label for="normal" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-500">${name}</label>
        <input type="text" id="${idInput}" class="${this.class.form.input}" autocomplete="false" placeholder="${placeholder}">
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-500"><span class="font-medium"></span></p>
      </div>`;

    container.innerHTML = inputHtml;

    const inputElement = container.querySelector('input');

    if (inputElement) {
      inputElement.addEventListener('change', (event) => {
        const searchTerm = event.target.value.toLowerCase();

        const objEncontrado = arrayObject.find(obj => {
          const valueToSearch = obj[buscarEnKey];
          if (searchTerm) {
            if (sarta) {
              return (valueToSearch && typeof valueToSearch === 'string' && valueToSearch.toLowerCase().includes(searchTerm));
            } else {
              return (valueToSearch && typeof valueToSearch === 'string' && valueToSearch.toLowerCase() == searchTerm);
            }
          }
        });

        if (objEncontrado) {
          this.applyStyles(inputElement, successClasses);
          callback(objEncontrado, true);
          inputElement.value = objEncontrado[buscarEnKey];
        } else {
          this.applyStyles(inputElement, errorClasses);
          callback(objEncontrado, false);
        }
      });
    } else {
      console.error('No se pudo encontrar el elemento input en la estructura HTML.');
    }
  }

  async createSearchInput(nameIdElement, table, id, name, where = '', titleId = 'ID:', titleName = 'Buscar:') {
    const searchName = `${nameIdElement}_searchName`;
    const containerSearchName = `${nameIdElement}_conten_search`;
    const searchInput = `${nameIdElement}_searchInput`;
    const sugerencia = `${nameIdElement}_sugerencia`;
    const error = `${nameIdElement}_error`;
    const cant = `${nameIdElement}_cant`;
    const data = `tmn${nameIdElement}`;
    const eleComponent = document.querySelector(`#${nameIdElement}`)
    let wr = ''

    if (where) {
      wr = ` -wr ${where}`
    }

    const sqlt = `-sl ${id} as id, ${name} as name -fr ${table} ${wr} -ob ${name}`;
    const records = await runCode(sqlt);
    this.setValue(data, records)
    this.setValue(nameIdElement, { id: 0, name: '' })
    this.setValue('itab', 0)


    let salidaHTML = `
        <div class="relative flex flex-col md:flex-row w-full text-sm text-neutral-900 bg-white rounded-lg border border-neutral-200  dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-white    tmn-fadeIn">
          <div id="${containerSearchName}" class="flex grow p-2.5  z-20 justify-start border-b dark:border-neutral-500 md:border-none cursor-pointer">
            <span class="text-neutral-600 dark:text-neutral-400 border-none outline-none mr-2">${titleName}</span>
            <span id="${searchName}" spellcheck="false"  class="font-semibold text-sky-700  dark:text-sky-500 border-none outline-none uppercase" contenteditable="true"></span>
            <span id="${sugerencia}" class=" text-neutral-400  dark:text-neutral-500 "></span>
            <span id="${error}" class="ml-2 text-red-400 font-bold dark:text-red-400 "></span>
            <span id="${cant}" class="ml-2 text-neutral-400  dark:text-neutral-500 "></span>
          </div>
          <div class="flex">
            <div class="block p-2.5 w-fit z-20 text-md text-right text-neutral-900  focus:outline-none  border-none border-neutral-300 focus:ring-sky-500 focus:border-sky-500  dark:border-l-neutral-700  dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:border-sky-500">
              <span class="text-neutral-700 dark:text-neutral-400  border-none outline-none">${titleId}</span>
            </div>
            <input type="search" id="${searchInput}"  class="block p-2.5 w-20 max-w-fit z-20 text-sm text-left font-semibold text-sky-700  focus:outline-none rounded-r-lg bg-white dark:bg-neutral-800 border-none border-neutral-300 focus:ring-sky-500 focus:border-sky-500  dark:border-l-neutral-700  dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-sky-500 dark:focus:border-sky-500 cursor-pointer" placeholder="..." >
          </div>
        </div>
    `;

    eleComponent.innerHTML = await salidaHTML;


    const eleSearchName = document.querySelector(`#${searchName}`)
    const eleContain = document.querySelector(`#${containerSearchName}`)
    const eleSearchInput = document.querySelector(`#${searchInput}`)
    const eleSugerencia = document.querySelector(`#${sugerencia}`)
    const eleError = document.querySelector(`#${error}`)
    const eleCant = document.querySelector(`#${cant}`)



    eleSearchInput.addEventListener('change', (elem) => {
      let value = elem.target.value;
      let result = '';
      if (value.length > 0) {
        const matchingClient = this.getValue(data).find((v) => {
          return (v.id == value)
        });

        if (matchingClient) {
          result = matchingClient.name;
          eleSearchName.innerHTML = result;
          eleSugerencia.innerHTML = '';
          eleError.innerHTML = '';
          this.setValue(nameIdElement, { id: value, name: result })
        } else {
          eleSearchName.innerHTML = '';
          eleSugerencia.innerHTML = `${result}`;
          eleError.innerHTML = ' -> El ID no existe!';
          this.setValue(nameIdElement, { id: 0, name: '' })
        }
      } else {
        eleSearchName.innerHTML = '';
        eleSugerencia.innerHTML = '';
        eleError.innerHTML = ' - No hay valor!';
        this.setValue(nameIdElement, { id: 0, name: '' })
      }
      if (this.functions[`${nameIdElement}Result`]) {
        let resultData = this.getValue(nameIdElement);
        this.functions[`${nameIdElement}Result`](resultData);
      } else {
        console.error(`la funcion ${nameIdElement}Result no existe en tamnora!`);
      }
      //console.log(this.getValue(nameIdElement))
    })


    eleContain.addEventListener('click', () => {
      eleSearchName.focus();
    })

    eleSearchName.addEventListener("focus", function () {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(this);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });

    eleSearchName.addEventListener('input', (e) => {
      e.preventDefault();
      let value = e.target.innerText.toLowerCase();
      value = value.replace(/\s+/g, '_');
      let result = '';

      if (value.length > 0) {
        const matchingClient = this.getValue(data).find((v) => {
          let compara = v.name.replace(/\s+/g, '_');
          return (compara.toLowerCase().startsWith(value))
        }
        );

        if (matchingClient) {
          result = matchingClient.name.substring(value.length);
          result = result.replace(/\s+/g, '&nbsp;');
          eleSugerencia.innerHTML = result;
          eleError.innerHTML = '';

        } else {
          eleSugerencia.innerHTML = result;
          eleError.innerHTML = ' - No encontrado!';
        }
      } else {
        eleSugerencia.innerHTML = result;
        eleError.innerHTML = '';
      }
    })


    eleSearchName.addEventListener('keydown', (event) => {
      if ([13, 39, 9].includes(event.keyCode)) {
        event.preventDefault();

        let value = event.target.innerText.toLowerCase();
        value = value.replace(/\s+/g, '_');
        let result;
        let resId, resName;
        let index = this.getValue('itab');

        if (value.length > 0) {
          const matchingClient = this.getValue(data).filter(v => {
            let compara = v.name.replace(/\s+/g, '_');
            return (compara.toLowerCase().startsWith(value))
          });


          if (matchingClient) {
            if (event.keyCode == 9) {
              if (index < matchingClient.length - 1) {
                index++
                this.setValue('itab', index);
              } else {
                index = 0;
                this.setValue('itab', index);
              }
              //console.log(matchingClient.length)
              result = matchingClient[index].name.substring(value.length);
              result = result.replace(/\s+/g, '&nbsp;');
              eleSugerencia.innerHTML = result;
              eleError.innerHTML = '';
              eleCant.innerHTML = `(${index + 1} de ${matchingClient.length})`;

            } else {
              if (matchingClient.length > 0) {
                console.log(matchingClient, index)
                resId = matchingClient[index].id;
                resName = matchingClient[index].name;


                eleSearchName.innerHTML = resName;
                eleSearchInput.value = resId;
                eleSugerencia.innerHTML = '';
                eleError.innerHTML = '';
                eleCant.innerHTML = '';
                eleSearchName.focus()
                this.setCaretToEnd(eleSearchName)
                this.setValue(nameIdElement, { id: resId, name: resName })
                // verSimpleForm();
              } else {
                console.error('No hay coincidencias');
                resId = 0;
                eleSearchName.innerHTML = resName;
                eleSearchInput.value = resId;
                eleSugerencia.innerHTML = '';
                eleError.innerHTML = '? No existe!';
                eleCant.innerHTML = '';
                eleSearchName.focus();
                this.setCaretToEnd(eleSearchName);

                this.setValue(nameIdElement, { id: 0, name: '' })
                // verSaldosAcumulados();
                // verSimpleForm();
              }

              if (this.functions[`${nameIdElement}Result`]) {
                let resultData = this.getValue(nameIdElement);
                this.functions[`${nameIdElement}Result`](resultData);
              } else {
                console.error(`la funcion ${nameIdElement}Result no existe en tamnora!`);
              }
            }
          }
        } else {
          eleSugerencia.innerHTML = '';
          eleError.innerHTML = '';
          eleCant.innerHTML = '';
          this.setValue(nameIdElement, { id: 0, name: '' })
        }

        //console.log(this.getValue(nameIdElement));
      }
    })



  }

  bindClickEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindToggleEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-dropdown-toggle]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-dropdown-toggle]');
    }

    elementsWithClick.forEach((element) => {
      const toggleData = element.getAttribute('data-dropdown-toggle');

      element.addEventListener('click', () => {
        document.querySelector(`#${toggleData}`).classList.toggle('hidden')
      });

    });
  }

  bindGroupInputs(componentDiv) {
    let tabButtons;
    if (componentDiv) {
      tabButtons = componentDiv.querySelectorAll('.tab-btn');
      componentDiv.querySelectorAll('.tab-content').forEach(content => {
        if(!content.classList.contains('es1')){
          content.classList.add('hidden');
        }
      });
      
    } else {
      tabButtons = document.querySelectorAll('.tab-btn');
      document.querySelectorAll('.tab-content').forEach(content => {
        if(!content.classList.contains('es1')){
          content.classList.add('hidden');
        }
      });
    }

    tabButtons.forEach((btn, index) => {
      //text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-700 font-medium
      btn.classList.remove('text-neutral-700', 'dark:text-neutral-200', 'bg-neutral-200', 'dark:bg-neutral-700', 'font-medium');
      btn.setAttribute('aria-current', 'false');
      if(index == 0){
        btn.classList.add('text-neutral-700', 'dark:text-neutral-200', 'bg-neutral-200', 'dark:bg-neutral-700', 'font-medium');
        btn.setAttribute('aria-current', 'true');
      }
    });

    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.add('hidden');
        });

        const tabId = button.getAttribute('data-tab');
        
        document.querySelectorAll(`.${tabId}`).forEach(content => {
          content.classList.remove('hidden');
        });

        tabButtons.forEach(btn => {
          btn.classList.remove('text-neutral-700', 'dark:text-neutral-200', 'bg-neutral-200', 'dark:bg-neutral-700', 'font-medium');
          btn.setAttribute('aria-current', 'false');
        });
        button.classList.add('text-neutral-700', 'dark:text-neutral-200', 'bg-neutral-200', 'dark:bg-neutral-700', 'font-medium');
        button.setAttribute('aria-current', 'true');
      });
    });
  }

  bindChangeEvents(componentDiv) {
    let elementsWithChange;
    let elementsWithOnChange;
    if (componentDiv) {
      elementsWithChange = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithChange = document.querySelectorAll('[data-change]');
    }

    elementsWithChange.forEach((element) => {
      const clickData = element.getAttribute('data-change');
      const [functionName, ...params] = clickData.split(',');
      if (functionName == 'currency') {
        element.addEventListener('change', (e) => { this.currency(e.target.value, e) });
      } else {

        if (params) {
          element.addEventListener('change', () => this.executeFunctionByName(functionName, params));
        } else {
          element.addEventListener('change', () => this.executeFunctionByName(functionName));
        }
      }
    });

    if (componentDiv) {
      elementsWithOnChange = componentDiv.querySelectorAll('[data-onchange]');
    } else {
      elementsWithOnChange = document.querySelectorAll('[data-onchange]');
    }

    elementsWithOnChange.forEach((element) => {
      const clickData = element.getAttribute('data-onchange');
      const [functionName, ...params] = clickData.split(',');

      if (params) {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e, params));
      } else {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e));
      }

    });
  }

  bindInputFile(componentDiv) {
    const isThis = this;
    let elementsWithInputFile;

    if (componentDiv) {
      elementsWithInputFile = componentDiv.querySelectorAll('[data-file]');
    } else {
      elementsWithInputFile = document.querySelectorAll('[data-file]');
    }

    elementsWithInputFile.forEach((element) => {
      const nameInputFile = element.getAttribute('data-file');
      const inputFile = element.querySelector(`#${nameInputFile}`);
      const dataOnChange = inputFile.getAttribute('data-ref');
      this.data[`${nameInputFile}_functionName`] = dataOnChange;

      const inicio = element.querySelector(`#${nameInputFile}_inicio`);
      const previewImage = element.querySelector(`#${nameInputFile}_previewImage`);
      const imagePreview = element.querySelector(`#${nameInputFile}_imagePreview`);
      const imageName = element.querySelector(`#${nameInputFile}_imageName`);
      const selectedImageName = element.querySelector(`#${nameInputFile}_selectedImageName`);

      inputFile.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const isFunc = isThis.data[`${nameInputFile}_functionName`];
        const [functionName, ...params] = isFunc.split(',');
        const reader = new FileReader();

        if (functionName) {
          if (params) {
            isThis.executeFunctionByName(functionName, event, params);
          } else {
            isThis.executeFunctionByName(functionName, event);
          }
        }

        reader.onload = function (e) {
          previewImage.src = e.target.result;
          imagePreview.classList.remove('hidden');
          imageName.classList.remove('hidden');
          selectedImageName.innerText = file.name; // Mostrar el nombre de la imagen seleccionada
          inicio.style.display = 'none'; // Oculta el label cuando se carga la imagen
        };

        reader.readAsDataURL(file);
      });

    });

    // if (componentDiv) {
    //   elementsWithOnChange = componentDiv.querySelectorAll('[data-onchange]');
    // } else {
    //   elementsWithOnChange = document.querySelectorAll('[data-onchange]');
    // }

    // elementsWithOnChange.forEach((element) => {
    //   const clickData = element.getAttribute('data-change');
    //   const [functionName, ...params] = clickData.split(',');

    //   if (params) {
    //     element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e, params));
    //   } else {
    //     element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e));
    //   }

    // });
  }

  async bindComponents() {
    // Obtener todos los elementos del DOM
    const allElements = document.getElementsByTagName('*');

    // Filtrar los elementos cuyos nombres de etiqueta comiencen con "t-"
    const componentDivs = [];
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.tagName.toLowerCase().startsWith('t-')) {
        componentDivs.push(element);
      }
    }


    const cantComponents = componentDivs.length;
    if (cantComponents) {
      componentDivs.forEach(async (componentDiv, index) => {
        const tagName = componentDiv.tagName.toLowerCase();
        const component = tagName.substring(2); // Eliminar "t-" del nombre
        const componentName = component.charAt(0).toUpperCase() + component.slice(1);
        const objSlots = {};
        const setSlots = componentDiv.querySelectorAll('[set-slot]');

        await fetch(`${this.componentDirectory}/${componentName}.html`)
          .then((response) => response.text())
          .then((html) => {
            this._componentHTML[componentName] = html;
          })
          .catch((error) => console.error(`Error al cargar el componente ${componentName}:`, error));

        if (setSlots) {
          setSlots.forEach(slot => {
            const nameSlot = slot.getAttribute('set-slot')
            objSlots[nameSlot] = slot.innerHTML;
          })
        }

        if (this._componentHTML[componentName] !== 'undefined') {
          componentDiv.innerHTML = this._componentHTML[componentName];
          const getSlots = componentDiv.querySelectorAll('[get-slot]')
          if (getSlots) {
            getSlots.forEach(slot => {
              const nameSlot = slot.getAttribute('get-slot')
              if (objSlots[nameSlot]) {
                slot.innerHTML = objSlots[nameSlot];
              } else {
                slot.innerHTML = '<span class="text-red-500">set-slot ?</span>'
              }
            })
          }

        } else {
          console.error(`Error al cargar el componente ${componentName}:`)
        }




        this.applyDataPropsFromAttributes(componentDiv);

        // Aquí invocamos las functions solo para el componente actual
        this.bindElementsWithDataValues(componentDiv);
        this.bindClickEvents(componentDiv);
        this.bindSubmitEvents(componentDiv);
        this.applyStyleClasses(componentDiv);
        this.applyStyleClassesNavActive(componentDiv);

        // Nuevo: Vincular eventos de clic dentro del componente Navbar
        const navbarItems = componentDiv.querySelectorAll('[data-navactive]');
        navbarItems.forEach((item) => {
          item.addEventListener('click', () => {
            const navactive = item.getAttribute('data-navactive');
            this.setState('navactive', parseInt(navactive, 10));
          });
        });

        if ((cantComponents - 1) == index) {
          // Ejecutamos la función onMount cuando el DOM esté cargado
          this.bindDataFor();
          this.applyStyleClasses();
          this.applyStyleClassesNavActive();
          this.onDOMContentLoaded();
          this.blidToggleThemeButton()
        }
      });
    } else {
      // Ejecutamos la función onMount cuando el DOM esté cargado
      document.addEventListener('DOMContentLoaded', () => {
        this.bindDataFor();
        this.applyStyleClasses();
        this.applyStyleClassesNavActive();
        this.onDOMContentLoaded();
        this.blidToggleThemeButton()
      });

    }
  }

  applyDataPropsFromAttributes(componentDiv) {
    const dataProps = {};
    const groupGet = [];
    const attributes = componentDiv.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('set-')) {
        const propName = attr.name.replace('set-', '');
        groupGet.push(propName);
        dataProps[propName] = attr.value;
      }
    }
    if (groupGet) {
      groupGet.forEach(propName => {
        const elementsWithDataProp = componentDiv.querySelectorAll(`[get-${propName}]`); // Agrega aquí otros selectores si necesitas más atributos get-

        elementsWithDataProp.forEach((element) => {
          if (element) {
            element.textContent += dataProps[propName];
          }
        });
      })
    }
  }

  applyStyleClasses(componentDiv) {
    let elementsWithTail;
    if (componentDiv) {
      elementsWithTail = componentDiv.querySelectorAll('[data-tail]');
    } else {
      elementsWithTail = document.querySelectorAll('[data-tail]');
    }
    elementsWithTail.forEach((element) => {
      const classes = element.getAttribute('data-tail').split(' ');
      classes.forEach((cls) => {
        if (this.class[cls]) {
          const arrayClases = this.class[cls].split(/\s+/).filter(Boolean)
          arrayClases.forEach((styleClass) => {
            element.classList.add(styleClass);
          });
        }
      });
    });
  }

  applyStyleClassesNavActive(componentDiv) {
    let elementsWithNavActive;

    if (componentDiv) {
      elementsWithNavActive = componentDiv.querySelectorAll('[data-navactive]');
    } else {
      elementsWithNavActive = document.querySelectorAll('[data-navactive]');
    }
    const navactive = this.getState('navactive');
    elementsWithNavActive.forEach((element) => {
      const item = element.getAttribute('data-navactive');
      if (this.class['navactive'] && item == navactive) {
        const arrayClases = this.class['navactive'].split(/\s+/).filter(Boolean)
        arrayClases.forEach((styleClass) => {
          element.classList.add(styleClass);
        });
      }
    });
  }

  blidToggleThemeButton() {
    const toggleThemeButton = document.querySelector('[data-theme]');
    let darkClass = '';
    let lightClass = '';
    if (toggleThemeButton) {
      this.theme == 'dark' ? darkClass = 'hidden' : lightClass = 'hidden';

      toggleThemeButton.innerHTML = `<svg id="theme-toggle-dark-icon" class="${darkClass} w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
    <svg id="theme-toggle-light-icon" class="${lightClass} w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    `
      toggleThemeButton.addEventListener('click', () => {
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');

        if (localStorage.getItem('color-theme')) {
          if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');

          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');

          }

          // if NOT set via local storage previously
        } else {
          if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
          } else {
            document.documentElement.classList.add('dark');
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
            localStorage.setItem('color-theme', 'dark');
          }
        }
        this.changeThemeColor();
      })
    }

  }

  bindData(attribute) {
    const elementsWithDataValue = document.querySelectorAll(`[data-value="${attribute}"]`);
    elementsWithDataValue.forEach((element) => {
      const dataKey = element.getAttribute('data-value');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';

      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }

        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = "";
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }


        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] || false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataObj][dataProp] || '';

          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataObj][dataProp] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataObj][dataProp] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] || '';
        }

      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }

          console.log(valorDefaul)

          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;
        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataKey] || '';
          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataKey] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataKey] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataKey] || '';
        }
      }

    });
  }

  getNestedPropertyValue(obj, propPath) {
    const props = propPath.split('.');
    let value = obj;
    for (const prop of props) {
      if (value.hasOwnProperty(prop)) {
        value = value[prop];
      } else {
        return '';
      }
    }
    return value;
  }

  bindElementsWithDataValues(componentDiv) {
    let elementsWithDataValue;
    if (componentDiv) {
      elementsWithDataValue = componentDiv.querySelectorAll('[data-value], [data-form]');
    } else {
      elementsWithDataValue = document.querySelectorAll('[data-value]');
    }

    elementsWithDataValue.forEach((element) => {
      const dataKey = element.hasAttribute('data-value') ? element.getAttribute('data-value') : element.getAttribute('data-form');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';

      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!dataObj in this.data) {
          this.data[dataObj] = {};
        }
        if (!dataProp in this.data[dataObj]) {
          this.data[dataObj][dataProp] = value ?? '';
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }



        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.tagName === 'TEXTAREA') {
          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] ?? false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {

          if (element.getAttribute('data-change') !== 'currency') {
            element.value = this.data[dataObj][dataProp] ?? '';

            if (isUpperCase) {
              element.addEventListener('input', (event) => {
                const newValue = event.target.value.toUpperCase();
                this.data[dataObj][dataProp] = newValue;
                event.target.value = newValue;
              });
            } else {
              element.addEventListener('input', (event) => {
                this.data[dataObj][dataProp] = event.target.value;
              });
            }
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] ?? '';
        }



      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }

          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;
        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {

          if (element.type == 'file') {
            // console.log('file', element)
          } else {
            element.value = this.data[dataKey] || '';
            if (isUpperCase) {
              element.addEventListener('input', (event) => {
                const newValue = event.target.value.toUpperCase();
                this.data[dataKey] = newValue;
                event.target.value = newValue;
              });
            } else {
              element.addEventListener('input', (event) => {
                this.data[dataKey] = event.target.value;
              });
            }
          }
        } else {
          element.textContent = this.data[dataKey] ?? '';
        }
      }

    });
  }

  updateElementsWithDataValue(dataKey, value, name) {
    let elementsWithDataValue;
    if (name) {
      const componentDiv = document.querySelector(`#${name}`);
      elementsWithDataValue = componentDiv.querySelectorAll(`[data-form="${dataKey}"]`);
    } else {
      elementsWithDataValue = document.querySelectorAll(`[data-value="${dataKey}"]`);
    }

    let typeObject = '';
    elementsWithDataValue.forEach((element) => {
      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!dataObj in this.data) {
          this.data[dataObj] = {};
        }
        if (!dataProp in this.data[dataObj]) {
          this.data[dataObj][dataProp] = value ?? '';
        }

        if (name) {
          typeObject = this.objects[name].midata[dataProp].type;
        }

        if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? '';
        } else if (element.tagName === 'INPUT') {
          if (typeObject == 'currency') {
            element.value = formatNumberArray(value)[2]
          } else if (typeObject == 'datetime-local') {
            document.querySelector(`[data-form="${dataKey}"]`).value = value
          } else {
            element.value = value ?? '';
          }
        } else {
          element.textContent = value ?? '';
        }
      } else {
        if (element.tagName === 'INPUT' && element.type !== 'checkbox') {
          element.value = value ?? '';
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? '';
        } else {
          element.textContent = value;
        }
      }
    });
  }

  saveStateToLocalStorage() {
    try {
      const serializedState = JSON.stringify(this.state);
      localStorage.setItem('tmnState', serializedState);
    } catch (error) {
      console.error('Error al guardar el state en el localStorage:', error);
    }
  }

  loadStateFromLocalStorage() {
    try {
      const serializedState = localStorage.getItem('tmnState');
      if (serializedState !== null) {
        return JSON.parse(serializedState);
      }
    } catch (error) {
      console.error('Error al cargar el state desde el localStorage:', error);
    }
    return {};
  }

  setState(key, value) {
    this.state[key] = value;
    this.saveStateToLocalStorage();
  }

  getState(key) {
    if (this.state[key]) {
      return this.state[key];
    } else {
      this.state[key] = this.loadStateFromLocalStorage();
      return this.state[key];
    }
  }

  bindSubmitEvents(componentDiv) {
    let forms;
    if (componentDiv) {
      forms = componentDiv.querySelectorAll('form[data-action]');
    } else {
      forms = document.querySelectorAll('form[data-action]');
    }

    forms.forEach((form) => {
      const functionName = form.getAttribute('data-action');

      form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        this.executeFunctionByName(functionName);
      });

      form.addEventListener('keypress', function (event) {
        // Verificamos si la tecla presionada es "Enter" (código 13)
        if (event.keyCode === 13) {
          // Prevenimos la acción predeterminada (envío del formulario)
          event.preventDefault();

          // Obtenemos el elemento activo (el que tiene el foco)
          const elementoActivo = document.activeElement;

          // Obtenemos la lista de elementos del formulario
          const elementosFormulario = form.elements;

          // Buscamos el índice del elemento activo en la lista
          const indiceElementoActivo = Array.prototype.indexOf.call(elementosFormulario, elementoActivo);

          // Movemos el foco al siguiente elemento del formulario
          const siguienteElemento = elementosFormulario[indiceElementoActivo + 1];
          if (siguienteElemento) {
            siguienteElemento.focus();
          }
        }
      });
    });
  }

  executeFunctionByName(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en la librería Tamnora.`);
    }
  }

  execute(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en la librería Tamnora.`);
    }
  }

  onDOMContentLoaded() {
    if (typeof this.onMountCallback === 'function') {
      this.onMountCallback();
    }
  }

  onMount(fn) {
    if (typeof fn === 'function') {
      this.onMountCallback = fn;
    }
  }

  bindDataForOld() {
    const elementsWithDataFor = document.querySelectorAll('[data-for]');
    elementsWithDataFor.forEach((element) => {
      const dataForValue = element.getAttribute('data-for');
      const nameTemplate = element.getAttribute('data-template') || '';
      const [arrayName, values] = dataForValue.split(' as ');
      const dataArray = this.data[arrayName];
      const [valueName, index] = values.split(',');

      let content = '';
      let updatedContent = '';


      if (dataArray) {
        if (dataArray && Array.isArray(dataArray)) {

          if (nameTemplate) {
            if (!this.templates[nameTemplate]) {
              this.templates[nameTemplate] = element.innerHTML;
              content = element.innerHTML;
            } else {
              content = this.templates[nameTemplate];
            }
          } else {
            content = element.innerHTML
          }
          dataArray.forEach((item, index) => {
            updatedContent += this.replaceValueInHTML(content, valueName, item, index);
          });
          element.innerHTML = updatedContent;
          this.bindClickEvents(element);
        }
      } else {
        console.error(`No existe el array ${arrayName}`)
      }

    });
  }

  replaceValueInHTML(html, valueName, item, index) {
    return html.replace(new RegExp(`{${valueName}(\\..+?|)(\\s*\\|\\s*index\\s*)?}`, 'g'), (match) => {
      const propertyAndFilter = match.substring(valueName.length + 1, match.length - 1);
      let [property, filter] = propertyAndFilter.split(/\s*\|\s*/);
      property = property.trim();
      if (property === '.index') {
        return index;
      } else if (property) {
        const value = this.getPropertyValue(item, property);
        if (filter) {
          const filterFn = this.getFilterFunction(filter);
          return filterFn(value);
        } else {
          return value;
        }
      } else {
        return match;
      }
    });
  }

  bindDataFor(componentDiv) {
    let elementsWithDataFor;
    if (componentDiv) {
      elementsWithDataFor = componentDiv.querySelectorAll('[data-for]');
    } else {
      elementsWithDataFor = document.querySelectorAll('[data-for]');
    }

    elementsWithDataFor.forEach((element) => {
      const id = element.id;
      const dataFor = element.getAttribute('data-for');
      const dataAs = element.getAttribute('data-as');
      const myArray = this.get(dataFor);
      let template;

      if (myArray) {
        if (!Array.isArray(myArray)) {
          console.error(`Error: '${dataFor}' is not an array.`);
          return;
        }

        if (id) {
          if (`${id}_datafor` in this.data) {
            template = this.data[`${id}_datafor`];
          } else {
            const templateElement = element.querySelector('template');
            template = templateElement.innerHTML;
            this.data[`${id}_datafor`] = template;
          }
        } else {
          if (`${dataFor}_datafor` in this.data) {
            template = this.data[`${dataFor}_datafor`];
          } else {
            const templateElement = element.querySelector('template');
            template = templateElement.innerHTML;
            this.data[`${dataFor}_datafor`] = template;
          }
        }
        element.innerHTML = '';

        const matches = template.match(new RegExp(`{${dataAs}\.(.*?)}|{${dataAs}}`, 'g'));
        const keys = [];

        matches.forEach(item => {
          let cleanValue = item.replace(/{|}/g, '');
          const parts = cleanValue.split('.');
          const valueToAdd = parts.length > 1 ? parts[1] : parts[0];

          if (!keys.includes(valueToAdd)) {
            keys.push(valueToAdd);
          }
        });

        const updatedContent = myArray.map((item, index) => {
          let filledTemplate = template;

          if (typeof item === 'object') {
            keys.forEach(key => {
              const regex = new RegExp(`{${dataAs}\\.${key}}`, 'g');
              if (item[key]) {
                filledTemplate = filledTemplate.replace(regex, item[key]);
              } else {
                if (key === 'index') {
                  filledTemplate = filledTemplate.replace(regex, index);
                }
              }
            });
          } else {
            keys.forEach(key => {
              if (key !== 'index') {
                const regex1 = new RegExp(`{${dataAs}}`, 'g');
                filledTemplate = filledTemplate.replace(regex1, item);
              } else {
                const regex2 = new RegExp(`{${dataAs}\\.${key}}`, 'g');
                filledTemplate = filledTemplate.replace(regex2, index);
              }
            });
          }
          return filledTemplate;
        }).join('');

        element.innerHTML = updatedContent;
      }
      this.bindClickEvents(element);
    });

  }

  getPropertyValue(item, property) {
    const properties = property.replace('.', '');
    let value = item[properties];
    return value;
  }

  getFilterFunction(filter) {
    if (filter === 'uppercase') {
      return (value) => value.toUpperCase();
    }

    if (filter === 'lowercase') {
      return (value) => value.toLowerCase();
    }

    if (filter === 'importe') {
      return (value) => value.toLocaleString('es-AR')
    }

    return (value) => value;
  }

  refreshDataFor(template) {
    const elementsWithDataFor = document.querySelectorAll(`[data-template="${template}"]`);
    elementsWithDataFor.forEach((element) => {
      const dataForValue = element.getAttribute('data-for');
      const nameTemplate = element.getAttribute('data-template') || '';
      const [arrayName, values] = dataForValue.split(' as ');
      const dataArray = this.data[arrayName];
      const [valueName, index] = values.split(',')

      let content = '';
      let updatedContent = '';


      if (dataArray) {
        if (dataArray && Array.isArray(dataArray)) {

          if (nameTemplate) {
            if (!this.templates[nameTemplate]) {
              this.templates[nameTemplate] = element.innerHTML;
              content = element.innerHTML;
            } else {
              content = this.templates[nameTemplate];
            }
          } else {
            content = element.innerHTML
          }
          dataArray.forEach((item, index) => {
            updatedContent += this.replaceValueInHTML(content, valueName, item, index);
          });
          element.innerHTML = updatedContent;
          this.bindClickEvents(element);
          this.onDOMContentLoaded();
        }
      } else {
        console.error(`No existe el array ${arrayName}`)
      }


    });
  }

  handleNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-navactive]');
    navLinks.forEach((link) => {
      const navactive = link.getAttribute('data-navactive');
      if (navactive && currentPath === link.getAttribute('href')) {
        this.setState('navactive', parseInt(navactive, 10));
        this.applyStyleClassesNavActive();
      }
    });
  }

  handleNavigationOnLoad() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-navactive]');
    navLinks.forEach((link) => {
      const navactive = link.getAttribute('data-navactive');
      if (navactive && currentPath === link.getAttribute('href')) {
        this.setState('navactive', parseInt(navactive, 10));
      }
    });
  }

  setCaretToEnd(el) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  select(selector) {
    const element = document.querySelector(selector);
    if (element) {
      return {
        click: (callback) => {
          element.addEventListener('click', callback);
        },
        doubleClick: (callback) => {
          element.addEventListener('dblclick', callback);
        },
        focus: (callback) => {
          element.addEventListener('focus', callback);
        },
        blur: (callback) => {
          element.addEventListener('blur', callback);
        },
        change: (callback) => {
          element.addEventListener('change', (event) => {
            callback(event, element);
          });
        },
        select: (callback) => {
          element.addEventListener('select', (event) => {
            callback(event, element);
          });
        },
        input: (callback) => {
          element.addEventListener('input', (event) => {
            callback(event, element);
          });
        },
        enter: (callback) => {
          element.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              callback(event, element);
            }
          });
        },
        keyCodeDown: (callback, allowedKeys) => {
          element.addEventListener('keydown', (event) => {
            if (allowedKeys.includes(event.keyCode)) {
              event.preventDefault();
              callback(event, element);
            }
          });
        },
        hover: (enterCallback, leaveCallback) => {
          element.addEventListener('mouseenter', enterCallback);
          element.addEventListener('mouseleave', leaveCallback);
        },
        keydown: (callback) => {
          element.addEventListener('keydown', callback);
        },
        submit: (callback) => {
          element.addEventListener('submit', callback);
        },
        scroll: (callback) => {
          element.addEventListener('scroll', callback);
        },
        resize: (callback) => {
          element.addEventListener('resize', callback);
        },
        contextMenu: (callback) => {
          element.addEventListener('contextmenu', callback);
        },
        removeEvent: (event, callback) => {
          element.removeEventListener(event, callback);
        },
        html: (content) => {
          element.innerHTML = content;
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
          this.bindInputFile(element)
        },
        addClass: (content) => {
          element.classList.add(content);
        },
        removeClass: (content) => {
          element.classList.remove(content);
        },
        toggleClass: (content) => {
          element.classList.toggle(content);
        },
        containsClass: (content) => {
          return element.classList.contains(content);
        },
        removeAndAddClass: (arrRemove, arrAdd) => {
          arrRemove.forEach(itemRemove => {
            if (element.classList.contains(itemRemove)) {
              element.classList.remove(itemRemove)
            }
          })
          arrAdd.forEach(itemAdd => {
            if (!element.classList.contains(itemAdd)) {
              element.classList.add(itemAdd)
            }
          })
        },
        classRefresh: () => {
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
        },
        bindModel: () => {
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
          this.bindToggleEvents(element);
        },
        value: (newValue = null) => {
          if (!newValue == null) {
            element.value = newValue;
          }
          return element.value
        },
        setValue: (value) => {
          const elementType = element.tagName.toLowerCase();

          switch (elementType) {
            case 'select':
              Array.from(element.options).forEach((option) => {
                option.selected = option.value === value;
              });
              break;
            case 'input':
              if (element.type === 'checkbox') {
                element.checked = value;
              } else {
                element.value = value;
              }
              break;
            case 'textarea':
              element.value = value;
              break;
            default:
              console.warn(`No se puede establecer el valor para el elemento ${elementType}.`);
              break;
          }

          if (element.hasAttribute('data-form', 'data-value')) {
            const dataKey = element.hasAttribute('data-value') ? element.getAttribute('data-value') : element.getAttribute('data-form');
            if (dataKey.includes('!')) {
              const [dataObj, dataProp] = dataKey.split('!');
              this.data[dataObj][dataProp] = value;
            }
          }
        },
        setValuePesos: (value) => {
          const arrayValue = formatNumberArray(value);
          element.value = arrayValue[2];
        },
        setValueCurrency: (value) => {
          const arrayValue = formatNumberArray(value);
          element.value = arrayValue[1];
        },
        target: () => {
          return element.target
        },
        inFocus: () => {
          return element.focus()
        },
        setAttributes: (attrs) => {
          Object.keys(attrs).forEach((key) => {
            element.setAttribute(key, attrs[key]);
          });
        },

        getAttributes: () => {
          const attrs = {};
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },

        deleteAttribute: (attrName) => {
          if (element.hasAttribute(attrName)) {
            element.removeAttribute(attrName);
          }
        },

        hidden: () => {
          element.classList.remove('tmn-fadeIn');
          element.classList.add('tmn-fadeOut');
          element.hidden = true;
        },

        show: () => {
          element.classList.remove('tmn-fadeOut');
          element.classList.add('tmn-fadeIn');
          element.hidden = false;
        }

        // Agregar más eventos aquí según sea necesario
      };
    } else {
      console.error(`Elemento  '${selector}' no encontrado en el DOM.`);
      return null;
    }
  }

  selectAll(selector) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((element) => {
      return {
        click: (callback) => {
          element.addEventListener('click', callback);
        },
        doubleClick: (callback) => {
          element.addEventListener('dblclick', callback);
        },
        focus: (callback) => {
          element.addEventListener('focus', callback);
        },
        blur: (callback) => {
          element.addEventListener('blur', callback);
        },
        change: (callback) => {
          element.addEventListener('change', callback);
        },
        select: (callback) => {
          element.addEventListener('select', callback);
        },
        input: (callback) => {
          element.addEventListener('input', callback);
        },
        enter: (callback) => {
          element.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              callback();
            }
          });
        },
        hover: (enterCallback, leaveCallback) => {
          element.addEventListener('mouseenter', enterCallback);
          element.addEventListener('mouseleave', leaveCallback);
        },
        keydown: (callback) => {
          element.addEventListener('keydown', callback);
        },
        submit: (callback) => {
          element.addEventListener('submit', callback);
        },
        scroll: (callback) => {
          element.addEventListener('scroll', callback);
        },
        resize: (callback) => {
          element.addEventListener('resize', callback);
        },
        contextMenu: (callback) => {
          element.addEventListener('contextmenu', callback);
        },
        removeEvent: (event, callback) => {
          element.removeEventListener(event, callback);
        },
        html: (content) => {
          element.innerHTML = content;
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
        },
        addClass: (content) => {
          element.classList.add(content);
        },
        removeClass: (content) => {
          element.classList.remove(content);
        },
        toggleClass: (content) => {
          element.classList.toggle(content);
        },
        value: element

        // ... (otros métodos, igual que en el método selector)
      };
    });
  }

  darkMode(option) {
    if (option) {
      if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        this.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        this.theme = 'light';
      }
    }
    this.changeThemeColor();
  }

  changeThemeColor() {
    let darkModeOn = document.documentElement.classList.contains('dark');
    const themeColorMeta = document.querySelector('head meta[name="theme-color"]');

    if (themeColorMeta) {
      const themeColorContent = themeColorMeta.getAttribute("content");
      if (darkModeOn) {
        if (themeColorContent != this.themeColorDark) {
          themeColorMeta.setAttribute('content', this.themeColorDark)
        }
      } else {
        if (themeColorContent != this.themeColorLight) {
          themeColorMeta.setAttribute('content', this.themeColorLight)
        }
      }
    }
    this.iframeData();
  }

  iframeData() {
    const iframes = document.querySelectorAll("iframe");

    // Recorre los iframes para buscar uno con data-theme="iframe"
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      iframe.contentWindow.postMessage('changeTheme');
      // Verifica si el atributo data-theme es igual a "iframe"
      if (iframe.getAttribute("data-theme") === "iframe") {
        // Se encontró un iframe con data-theme="iframe"
        console.log("Se encontró un iframe con data-theme='iframe'.");
        // Realiza aquí cualquier acción que necesites
      }
    }
  }

  listenerMessage() {
    const self = this;
    window.addEventListener("message", function (event) {
      if (event.data === "changeTheme") {
        // Cambiar el tema a oscuro aquí
        self.darkMode(true);
        self.changeThemeColor();
      } else if (event.data === "reloadObserv") {
        self.functions.reloadObserv();
      }
    });
  }

  currency(value, element) {
    let newValue = formatNumberArray(value);
    element.target.value = newValue[2];
    this.setValueRouteUni(element.target.dataset.form, newValue[0]);
  }

  pesos(numero, decimales, signo = '') {
    let numeroString = formatNumber(numero, { dec: decimales, symb: signo, type: 'currency' })
    return `${numeroString}`;
  }

  getParams(decode = true) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = [];
    let name, value;
    urlParams.forEach((val, nam) => {
      name = nam;
      value = val;
      if (decode) {
        name = atob(nam);
        value = atob(val);
      }
      params.push({ name, value });
    })
    return params;
  }

  goTo(url, params = [], code = true) {
    let values = '';
    let value = '';
    let name = '';
    if (params.length > 0) {
      values = '?'
      params.forEach(data => {
        value = data.value;
        name = data.name;
        if (code) {
          value = btoa(value);
          name = btoa(name);
        }
        values += `${name}=${value}`
      })
    }
    globalThis.location.href = `${url}${values}`
  }

  popState(accion) {
    window.addEventListener('popstate', function (event) {
      // Aquí puedes realizar acciones basadas en el cambio de historial,
      // como cargar el contenido correspondiente según la nueva URL o el estado.
      accion(event)
    });
  }

  isDateInRange(startDate, endDate, today) {
    // Convert the date strings to Date objects
    var startDateObj = new Date(startDate);
    var endDateObj = new Date(endDate);
    var todayObj = new Date(today);

    // Check if today is within the range of startDate and endDate
    return todayObj >= startDateObj && todayObj <= endDateObj;
  }

  async dLookup(columna, tabla, condicion) {
    const resp = await runCode(`-sl ${columna} -fr ${tabla} -wr ${condicion}`);
    return resp[0][columna]
  }

  async dLookupAll(columna, tabla, condicion) {
    const resp = await runCode(`-sl ${columna} -fr ${tabla} -wr ${condicion}`);
    return resp
  }

  padLeft(str, length = 4, character = '0') {
    while (str.length < length) {
      str = character + str;
    }
    return str;
  }

  padRight(str, length = 4, character = '0') {
    while (str.length < length) {
      str = str + character;
    }
    return str;
  }

  createButton(options = {}) {
    if (!options.title) options.title = 'Nuevo Botón';
    if (!options.className) options.className = 'btnNeutral';
    if (!options.position) options.position = 'left';
    if (!options.dataClick) options.dataClick = 'dataClick';

    let myBtn = `<button type="button" `;

    if (options.dataClick) {
      myBtn += ` data-click="${options.dataClick}"`;
    }
    myBtn += ` class="${this.class[options.className]}">`;

    if (options.icon) {
      if (options.position == 'left') {
        myBtn += `${options.icon} ${options.title}`;
      } else {
        myBtn += `${options.title} ${options.icon}`;
      }
    } else {
      myBtn += `${options.title}`;
    }
    myBtn += `</button>`;
    return myBtn;
  }

  createSearch(options = {}) {
    let name = 'auto';
    if (!options.thisName) {
      options.thisName = name;
    } else {
      name = options.thisName;
    }
    if (!options.value) options.value = `${name}_textSearch`;
    if (!options.change) options.change = `textSearchGo`;
    if (!options.inputClass) options.inputClass = 'bg-neutral-50 text-neutral-600 focus:border-sky-400 dark:bg-neutral-700/50 dark:text-neutral-300 dark:border-neutral-800';
    if (!options.iconClass) options.iconClass = 'text-neutral-500 dark:text-neutral-400';

    this.setValue(`${name}_textSearch`, '');

    let comp = `
    <div class="relative" >
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ${options.iconClass}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
      </svg>
    </div>
    <input
      type="search" 
      name="search"
      autoComplete="off"
      data-value="${options.value}"
      data-change = "${options.change},${options.thisName}"
      class="block w-full py-2 px-3 ps-10 text-sm font-normal border rounded-lg outline-none shadow-sm ${options.inputClass}" 
      placeholder='Buscar...' />
  </div>
    `


    return comp
  }

  createFileInput(options = {}) {
    if (!options.inputClass) options.inputClass = `block w-full mb-5 text-sm text-neutral-900 border border-neutral-300 rounded-lg cursor-pointer bg-neutral-50 dark:text-neutral-400 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400`;
    if (!options.accept) options.accept = '*'; // Acepta todos los tipos de archivos por defecto

    let comp = `
    <input
      type="file"
      name="file"
      accept="${options.accept}"
      class="${options.inputClass}" />
    `;
    return comp;
  }

  createInputArray(idContainer) {
    const inArray = [];
    let input = "";
    let editingIndex = null;

    const agregarUnidad = (event) => {
      const value = event.target.value;
      if (value !== "") {
        if (editingIndex !== null) {
          inArray[editingIndex] = value;
          editingIndex = null;
        } else {
          inArray.push(value);
        }
        input = "";
        render();
      }
    };

    const eliminarUnidad = (index) => {
      inArray.splice(index, 1);
      render();
    };

    const handleDragStart = (index) => {
      editingIndex = index;
    };

    const handleDrop = (index) => {
      const temp = inArray[editingIndex];
      inArray[editingIndex] = inArray[index];
      inArray[index] = temp;
      editingIndex = null;
      render();
    };

    const handleDoubleClick = (index) => {
      input = inArray[index];
      editingIndex = index;
      render();
    };

    const render = () => {
      const container = document.getElementById(idContainer);
      container.innerHTML = `
        <div class="p-4">
          <div class="border-2 border-neutral-300 p-2 rounded-md">
            ${inArray
          .map(
            (unidad, index) => `
                  <span
                    data-key="${index}"
                    class="bg-blue-100 rounded-full px-2 py-1 text-sm text-neutral-700 mr-2 mb-2 inline-flex items-center"
                    draggable="true"
                  >
                    ${unidad}
                    <button
                      class="ml-2 text-xs text-neutral-500"
                      data-index="${index}"
                    >x</button>
                  </span>
                `
          )
          .join("")}
            <input
              id="entrada"
              type="text"
              class="outline-none"
              value="${input}"
              placeholder="${editingIndex !== null ? "Editando..." : "Agregar..."
        }"
            />
          </div>
        </div>
      `;

      const deleteButtons = container.querySelectorAll('button[data-index]');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.getAttribute('data-index'));
          eliminarUnidad(index);
        });
      });

      const inputElement = container.querySelector('#entrada');
      inputElement.addEventListener('dblclick', () => {
        handleDoubleClick(-1);
      });

      inputElement.addEventListener('change', (e) => {
        agregarUnidad(e.target.value)
      });

      // AQUÍ Agrega event listener para el drag and drop
      const spanElements = container.querySelectorAll('span[data-key]');
      spanElements.forEach((span) => {
        span.addEventListener('dragstart', (e) => {
          const index = parseInt(span.getAttribute('data-key'));
          handleDragStart(index);
          e.dataTransfer.setData('text/plain', index);
        });

        span.addEventListener('dragover', (e) => {
          e.preventDefault();
        });

        span.addEventListener('drop', (e) => {
          e.preventDefault();
          const targetIndex = parseInt(span.getAttribute('data-key'));
          const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
          handleDrop(targetIndex);
        });
      });
    };

    render();
  }
  //Inicio
  createListArray(containerId, jsonArray, name = '', fn = (data) => { }) {
    const container = document.getElementById(containerId);
    const inArray = jsonArray ? JSON.parse(jsonArray) : [];
    this.setValue(`${containerId}_array`, [...inArray]);

    const list = document.createElement("ul");
    list.id = `${containerId}_list`;
    list.className = "w-full text-sm text-neutral-500 flex flex-col gap-1 rounded-lg dark:border-neutral-600 dark:text-neutral-400";

    const addItemInput = document.createElement("input");
    addItemInput.id = `${containerId}_inputInsert`;
    addItemInput.placeholder = "Agregar nuevo elemento...";
    addItemInput.className = "bg-white mt-2 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 ";
    addItemInput.addEventListener("change", (event) => {
      const newItem = event.target.value.trim();
      if (newItem !== "") {
        addItem(newItem);
        event.target.value = "";
      }
    });

    container.innerHTML = ""; // Limpiar el contenedor antes de agregar elementos
    if (name) {
      container.innerHTML = `<p class="flex items-center gap-1 pl-1 text-sm font-semibold text-neutral-600 dark:text-neutral-400">${name} </p>`;
    }

    container.appendChild(list);
    container.appendChild(addItemInput);

    // Función para agregar un nuevo ítem a la lista
    const addItem = (newItem, alArray = true, item) => {
      let textoIngresado = newItem;
      textoIngresado = textoIngresado.replace(/(\r|\n|\t)/gm, '');
      textoIngresado = textoIngresado.replace(/\s+/g, ' ');
      textoIngresado = textoIngresado.replace(/['"]/g, '*');
      textoIngresado = textoIngresado.trim();

      const listItem = document.createElement("li");
      listItem.className = "relative flex justify-between items-center rounded-lg px-4 py-3 border border-neutral-200 dark:border-neutral-700/70 bg-neutral-50/50 cursor-pointer dark:bg-neutral-800/80 hover:bg-neutral-200/30 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-neutral-100";
      listItem.draggable = true;
      // Establecer el ID con el nuevo índice
      if (alArray) {
        listItem.id = `${containerId}_item_${inArray.length}`;
      } else {
        listItem.id = `${containerId}_item_${item}`;
      }

      const spanText = document.createElement("span");
      spanText.textContent = textoIngresado;

      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.className = `w-full bg-transparent focus:text-sky-500 outline-none`;
      inputEdit.value = textoIngresado;
      inputEdit.style.display = "none"; // Ocultar el input inicialmente

      const buttonContainer = document.createElement("div"); // Container for buttons
      buttonContainer.className = "flex"; // Add flex class to align buttons horizontally

      const editButton = document.createElement("button");
      editButton.type = 'button';
      editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"></path>
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"></path>
        </svg>`;
      editButton.className = "text-blue-500 cursor-pointer mr-2"; // Add margin-right for spacing
      editButton.addEventListener("click", () => toggleEditMode(spanText, inputEdit, editButton));

      const deleteButton = document.createElement("button");
      deleteButton.type = 'button';
      deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd"></path>
        </svg>`;
      deleteButton.className = "text-red-500 cursor-pointer";
      deleteButton.addEventListener("click", () => removeItem(inArray.length));

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);

      listItem.appendChild(spanText); // Append the span text to the list item
      listItem.appendChild(inputEdit); // Append the input for editing to the list item
      listItem.appendChild(buttonContainer); // Append the button container to the list item

      listItem.addEventListener("dragstart", handleDragStart);
      listItem.addEventListener("dragover", handleDragOver);
      listItem.addEventListener("drop", handleDrop);

      // Agregar el nuevo elemento antes del botón de agregar

      // list.insertBefore(listItem, list.lastChild);
      list.appendChild(listItem)
      if (alArray) {
        inArray.push(textoIngresado); // Agregar el nuevo ítem al array de datos
        this.setValue(`${containerId}_array`, [...inArray]);
        fn(this.getValue(`${containerId}_array`))
      }
    };

    // Función para manejar el inicio del arrastre
    const handleDragStart = (event) => {
      event.dataTransfer.setData("text/plain", event.target.id);
    };

    // Función para manejar el arrastre sobre un elemento
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    // Función para manejar el soltar un elemento arrastrado
    const handleDrop = (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      const draggedItem = document.getElementById(data);
      const dropzone = event.target.closest("ul");
      dropzone.insertBefore(draggedItem, event.target);
      const newIndex = Array.from(dropzone.children).indexOf(draggedItem);
      const itemId = parseInt(data.split("_")[2]);
      const movedItem = inArray.splice(itemId, 1)[0];
      inArray.splice(newIndex, 0, movedItem);
      this.setValue(`${containerId}_array`, [...inArray]);
      renderItems();
      fn(this.getValue(`${containerId}_array`))
    };

    // Función para alternar entre el modo de edición y la visualización normal
    const toggleEditMode = (spanText, inputEdit, editButton) => {
      if (spanText.style.display !== "none") {
        // Mostrar el input y ocultar el span al editar
        spanText.style.display = "none";
        inputEdit.style.display = "inline-block";
        inputEdit.focus(); // Poner el foco en el input
        // editButton.textContent = "Guardar";

        // Cuando se guarda, actualizar el valor en el array y en el span, y mostrar el span nuevamente
        inputEdit.addEventListener("blur", () => {
          updateItemValue(spanText, inputEdit);
        });

        inputEdit.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            event.preventDefault(); // Evitar que se envíe el formulario si está dentro de uno
            updateItemValue(spanText, inputEdit);
          }
        });
      } else {
        // Guardar cambios al hacer clic en "Guardar"
        updateItemValue(spanText, inputEdit);
      }
    };

    // Función para actualizar el valor de un ítem
    const updateItemValue = (spanText, inputEdit) => {
      spanText.textContent = inputEdit.value;
      const index = parseInt(inputEdit.parentElement.id.split("_")[2]);

      let textoIngresado = inputEdit.value;
      textoIngresado = textoIngresado.replace(/(\r|\n|\t)/gm, '');
      textoIngresado = textoIngresado.replace(/\s+/g, ' ');
      textoIngresado = textoIngresado.replace(/['"]/g, '*');
      textoIngresado = textoIngresado.trim();

      inArray[index] = textoIngresado;
      spanText.style.display = "inline"; // Mostrar el span nuevamente
      inputEdit.style.display = "none"; // Ocultar el input
      inputEdit.removeEventListener("blur", () => { }); // Limpiar el event listener
      inputEdit.removeEventListener("keypress", () => { }); // Limpiar el event listener
      this.setValue(`${containerId}_array`, [...inArray]);
      fn(this.getValue(`${containerId}_array`))
    };

    // Función para eliminar un ítem
    const removeItem = (index) => {
      inArray.splice(index - 1, 1);
      console.log(index, inArray)
      this.setValue(`${containerId}_array`, [...inArray]);
      renderItems();
      fn(this.getValue(`${containerId}_array`))
    };

    const renderItems = () => {
      list.innerHTML = "";
      inArray.forEach((item, index) => {
        addItem(item, false, index)
      });
    }

    renderItems();

  }
  //Final
  createInputFile(options = {}) {
    if (!options.name) options.name = 'inputFileSelect';
    if (!options.className) options.className = 'btnNeutral';
    if (!options.onChange) options.onChange = '';
    if (!options.classWidth) options.classWidth = 'w-full';
    if (!options.classHeight) options.classHeight = 'h-64';
    if (!options.text) options.text = 'Click para seleccionar una imagen';
    if (!options.files) options.files = 'SVG, PNG, JPG or GIF (MAX. 800x400px)';
    if (!options.iconSVG) options.iconSVG = `<svg class="w-8 h-8 mb-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
</svg>`;

    let comp = `
    <div class="relative ${options.classWidth} ${options.classHeight}" data-file="${options.name}">
    <label for="${options.name}" class="flex flex-col items-center justify-center w-full h-full border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 dark:hover:bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-600">
        <div class="absolute top-0 left-0 w-full h-full z-10 bg-white opacity-0 transition-opacity duration-300">
          <input id="${options.name}" data-form="${options.name}" data-ref="${options.onChange}" type="file" class="hidden" />
        </div>
        <div id="${options.name}_imagePreview" class="absolute top-0 left-0 w-full h-full z-0 hidden">
          <img id="${options.name}_previewImage" class="w-full h-full object-cover rounded-lg" src="#" alt="Vista previa de la imagen">
        </div>
        <div id="${options.name}_imageName" class="absolute bottom-0 left-0 w-full text-xs p-2 bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 rounded-b-lg hidden">
          Nombre del Archivo: <span id="${options.name}_selectedImageName" class="font-semibold"></span>
        </div>
        <div id="${options.name}_inicio" class="flex flex-col items-center justify-center pt-5 pb-6">
            ${options.iconSVG}
            <p class="mb-2 text-sm text-neutral-500 dark:text-neutral-400"><span class="font-semibold">${options.text}</span> </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">${options.files}</p>
        </div>
    </label>
  </div>
    `;
    return comp;
  }

  resetInputFile(name) {
    let element = document.querySelector(`[data-file="${name}"]`);
    const nameInputFile = element.getAttribute('data-file');
    const inputFile = element.querySelector(`#${nameInputFile}`);
    const inicio = element.querySelector(`#${nameInputFile}_inicio`);
    const previewImage = element.querySelector(`#${nameInputFile}_previewImage`);
    const imagePreview = element.querySelector(`#${nameInputFile}_imagePreview`);
    const imageName = element.querySelector(`#${nameInputFile}_imageName`);
    const selectedImageName = element.querySelector(`#${nameInputFile}_selectedImageName`);

    inputFile.value = '';
    previewImage.src = "#";
    imagePreview.classList.add('hidden');
    imageName.classList.add('hidden');
    selectedImageName.innerText = '';
    inicio.style.display = 'flex';
  }

  imageInputFile(name, image, predet = null) {
    if (image) {
      let element = document.querySelector(`[data-file="${name}"]`);
      let srcImage = `${SERVER}/uploads/${image}`
      const nameInputFile = element.getAttribute('data-file');
      const inicio = element.querySelector(`#${nameInputFile}_inicio`);
      const previewImage = element.querySelector(`#${nameInputFile}_previewImage`);
      const imagePreview = element.querySelector(`#${nameInputFile}_imagePreview`);
      const imageName = element.querySelector(`#${nameInputFile}_imageName`);
      const selectedImageName = element.querySelector(`#${nameInputFile}_selectedImageName`);


      // Crear un nuevo objeto de imagen
      const img = new Image();

      // Manejar el evento 'load' para verificar si la imagen se ha cargado correctamente
      img.onload = function () {
        // La imagen es válida, establecer la src y mostrarla
        previewImage.src = srcImage;
        imagePreview.classList.remove('hidden');
        imageName.classList.remove('hidden');
        selectedImageName.innerText = image; // Mostrar el nombre de la imagen seleccionada
        inicio.style.display = 'none'; // Oculta el label cuando se carga la imagen
      };

      // Manejar el evento 'error' para manejar el caso en el que la imagen no se puede cargar
      img.onerror = function () {
        // La imagen no es válida, puedes hacer algo aquí, como mostrar un mensaje de error o establecer una imagen predeterminada
        console.error("La imagen no se puede cargar");
        if (predet) {
          console.log(predet)
          previewImage.src = predet;
          imagePreview.classList.remove('hidden');
        }
        // Por ejemplo, puedes establecer una imagen predeterminada
        //previewImage.src = 'ruta/a/imagen-predeterminada.jpg';
      };

      // Establecer la src de la imagen para iniciar la carga
      img.src = srcImage;
    }

  }

  createNewObject(fieldName, type, value, key) {
    return {
      "type": type,
      "name": fieldName,
      "required": false,
      "placeholder": "",
      "value": value,
      "column": "",
      "field": fieldName,
      "observ": "",
      "rows": "3",
      "attribute": 0,
      "hidden": false,
      "pattern": '',
      "class": '',
      "defaultValue": "...",
      "elegirOpcion": false,
      "key": key,
      "introDate": false,
      "setDate": 0,
      "change": '',
      "options": [],
      "noData": false,
      "validate": ''
    };
  }

  handleStructure(name, structure) {
    const groupType = {};
    const primaryKey = {};

    if (structure.length > 0) {
      structure.forEach(val => {
        let name = val.COLUMN_NAME.toLowerCase()
        groupType[name] = this.typeToType(val.DATA_TYPE);
        primaryKey[name] = val.COLUMN_KEY;
      })
    } else {
      if (this.objects[name].structure.length > 0) {
        this.objects[name].structure.forEach(val => {
          let name = val.COLUMN_NAME.toLowerCase()
          groupType[name] = this.typeToType(val.DATA_TYPE);
          primaryKey[name] = val.COLUMN_KEY;
        })
      }
    }

    return { groupType, primaryKey };
  }

  handleDataObject(dataObject, groupType, primaryKey, clean = false, name) {
    const newObject = {};
    const newObjectClean = {};

    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';
        let cleanValue = '';

        if (type == 'datetime') {
          value = formatDate(new Date(value)).fechaHora;
        }

        if (clean) {
          if (type == 'number') {
            value = 0;
          } else {
            value = '';
          }
        } else {
          if (value == null) {
            value = '';
          }
        }

        if (type == 'number') {
          cleanValue = 0;
        } else {
          cleanValue = '';
        }

        if (fieldName in groupType) {
          type = groupType[fieldName];
        }

        if (fieldName in primaryKey) {
          key = primaryKey[fieldName];
        }

        newObjectClean[fieldName] = cleanValue;
        newObject[fieldName] = this.createNewObject(fieldName, type, value, key);
      }
    }

    this.setValue(`${name}_clean`, newObjectClean)

    return newObject;
  }

  newForm(name) {
    let nameForm = name;
    if (!nameForm) {
      nameForm = `form${this.cantForms}`;
    }
    const divTabla = document.getElementById(nameForm);

    if (!divTabla) {
      this.createDiv(nameForm, 'w-full')
    }

    if (!(nameForm in this.objects)) {
      this.objects[nameForm] = {
        midata: { form: 'Faltan cargar datos al formulario' },
        formOptions: {},
        table: '',
        type: 'form',
        view: 'normal',
        key: '',
        focus: '',
        id: null,
        columns: [],
        camposOrden: {},
        numberAlert: 0,
        resetOnSubmit: false,
        structure: [],
        formElement: '',
        modalName: '',
        name: nameForm,
        addDataFromRunCode: async (sqCode) => { await this.addDataFromRunCode(nameForm, sqCode) },
        addDataFromDBSelect: async (sql) => { await this.addDataFromDBSelect(nameForm, sql) },
        addData: async (obj, clean = false) => { await this.addObject(nameForm, obj, clean) },
        createForm: (options) => { this.createForm(options, nameForm) },
        setData: (fieldName, key, value) => { this.setData(fieldName, key, value, nameForm) },
        getData: (fieldName, key) => { this.getData(fieldName, key, nameForm) },
        resetData: () => {
          this.data[nameForm] = { ...this.data[`${nameForm}_clean`] };
          this.updateForm(nameForm);
        },
        newData: () => {
          this.data[nameForm] = { ...this.data[`${nameForm}_clean`] };
          this.updateForm(nameForm);
        },
        setDataKeys: (key, objectNameValue) => { this.setDataKeys(key, objectNameValue, nameForm) },
        addDataSpecial: (fieldName, type, value) => { this.addObjectSpecial(nameForm, fieldName, type, value) },
        update: () => { this.updateForm(nameForm) },
        updateData: (updates) => {
          this.setDataObject(updates, nameForm)
          this.updateForm(nameForm);
        },
        openModal: () => { this.functions.openModal(nameForm) },
        closeModal: () => { this.functions.closeModal(nameForm) },
        onSubmit: (fn) => { this.setFunction(`onSubmit_${nameForm}`, fn) },
        onDelete: (fn) => { this.setFunction(`onDelete_${nameForm}`, fn) },
        onMount: () => { },
        onCloseModal: (fn) => { this.setFunction(`onCloseModal_${nameForm}`, fn) },
        labelCapitalize: () => { this.labelCapitalize(nameForm) }
      }

    }

    this.cantForms++;
    this.setValue(nameForm, {});
    return this.objects[name]
  }

  newTable(name = '') {
    let nameTable = name;

    if (!nameTable) {
      nameTable = `tabla${this.cantTables}`;
    }
    const divTabla = document.getElementById(nameTable);

    if (!divTabla) {
      this.createDiv(nameTable, 'w-full')
    }

    if (!(nameTable in this.objects)) {
      this.objects[nameTable] = {
        type: 'table',
        midata: [{ Tabla: 'Falta los datos de la tabla' }],
        dataArray: [],
        from: 1,
        recordsPerView: 10,
        paginations: true,
        name: nameTable,
        tableOptions: {},
        tableElement: '',
        functions: {},
        loader: false,
        structure: [],
        searchValue: '',
        searchColumns: [],
        columns: [],
        widthColumns: [],
        widthTable: 'w-full',
        widthPadre: 'w-full',
        arrayOrder: [],
        defaultDataRow: {},
        addData: (arr) => { this.addArray(nameTable, arr) },
        addDataFromRunCode: async (sqCode) => { await this.addDataFromRunCode(nameTable, sqCode) },
        addDataFromDBSelect: async (sql) => { await this.addDataFromDBSelect(nameTable, sql) },
        createTable: (options) => { this.createTable(options, nameTable) },
        updateData: (arr) => {
          this.updateArray(nameTable, arr);
          this.updateTable(nameTable);
        },
        filterData: (textSearch) => {
          this.objects[nameTable].from = 1;
          this.objects[nameTable].searchValue = textSearch;
          this.updateTable(nameTable)
        },
        refresh: () => { this.updateTable(nameTable) },
        loadingTable: (obj = {}) => {
          let { rows = 5, cols = 4, withHeader = false } = obj
          this.objects[nameTable].loader = true;
          this.loadingTable(nameTable, rows, cols, withHeader);
        },
        setData: (fieldName, key, value) => { this.setData(fieldName, key, value, nameTable) },
        getData: (fieldName, key) => { this.getData(fieldName, key, nameTable) },
        setDataKeys: (key, objectNameValue) => { this.setDataKeys(key, objectNameValue, nameTable) },
        labelCapitalize: () => { this.labelCapitalize(nameTable) }
      }
    }

    this.cantTables++;
    return this.objects[nameTable]
  }

  addArray(name, arr = [{ datos: 'Falta datos de la tabla' }]) {
    this.removeAll(name);
    this.objects[name].from = 1;
    // this.setDefaultRow(name, arr[0]);
    this.setValue(name, arr);

    const obj = convertirFormatoFecha(arr[0])
    this.addObject(name, obj)
  }

  updateArray(name, arr = [{ datos: 'Falta datos de la tabla' }]) {
    this.objects[name].from = 1;
    this.setValue(name, arr);
  }

  addObject(name, obj, clean = false) {
    const dataObject = new Object(convertirFormatoFecha(obj))
    const structure = this.objects[name]?.structure || [];
    const { groupType, primaryKey } = this.handleStructure(name, structure);
    const newObject = this.handleDataObject(dataObject, groupType, primaryKey, clean, name);

    if (this.objects[name].type == 'form') {
      this.objects[name].midata = newObject;
      this.setValue(name, dataObject);
    } else {
      // this.objects[name].midata.push(newObject);
      this.objects[name].midata = newObject;
    }
  }

  addObjectSpecial(name, fieldName, type, value) {
    const objSpecial = this.createNewObject(fieldName, type, value);
    objSpecial.noData = true

    this.objects[name].midata[fieldName] = objSpecial;
    this.setValue(fieldName, '');

  }

  async runSQL(sql) {
    let rstData = await dbSelect('s', sql)
    return rstData
  }

  async runCode(sqCode) {
    let rstData = await runCode(sqCode);
    return rstData
  }

  async addDataFromDBSelect(name, sql) {
    let rstData = await dbSelect('s', sql)
    console.log(rstData)
  }

  async addDataFromRunCode(name, sqCode) {
    let rstData = await runCode(sqCode);
    if (this.objects[name].type == 'form') {
      this.addObject(name, rstData[0]);
    } else {
      this.addArray(name, rstData)
    }

  }

  cleanDataObject(originalObject) {
    const newObject = {};
    for (const clave in originalObject) {
      // Verificar si la propiedad es un objeto y no es nulo
      if (typeof originalObject[clave] === 'object' && originalObject[clave] !== null) {
        // Recursivamente crear un nuevo objeto en blanco para propiedades objeto
        newObject[clave] = cleanDataObject(originalObject[clave]);
      } else {
        // Establecer el valor en blanco
        newObject[clave] = '';
      }
    }
    return newObject;
  }

  async setStructure(table, key = '', reset = false, name) {
    let ejecute = false;
    if (this.objects[name].structure.length == 0 || reset == true) {
      ejecute = true;
    } else {
      return true
    }

    if (ejecute) {
      let struc = await structure('t', table);
      if (!struc[0].resp) {
        this.objects[name].table = table;
        this.objects[name].key = key;

        const newStruc = []
        struc.forEach(data => {
          data.table = table;
          data.COLUMN_NAME = data.COLUMN_NAME.toLowerCase()
          newStruc.push(data);
        })

        this.objects[name].structure = newStruc;

      } else {
        console.error(struc[0].msgError, struc[0].err)
        return false
      }
    }
  }

  typeToType(inType = 'text') {
    let outType;
    if (inType == 'int') outType = 'number';
    if (inType == 'tinyint') outType = 'number';
    if (inType == 'double') outType = 'number';
    if (inType == 'char') outType = 'text';
    if (inType == 'varchar') outType = 'text';
    if (inType == 'datetime') outType = 'datetime-local';
    if (inType == 'timestamp') outType = 'datetime-local';
    if (inType == 'date') outType = 'date';
    if (inType == 'time') outType = 'time';
    if (inType == 'decimal') outType = 'currency';
    if (inType == 'text') outType = 'text';
    if (inType == 'longtext') outType = 'text';

    if (!outType) {
      console.error(`inType ${inType} no definido!`)
      outType = 'text'
    }

    return outType
  }

  detectDataType(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return "number";
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return "datetime";
    } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      return "datetime-local";
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return "date";
    } else if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
      return "email";
    } else if (/^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/.test(value)) {
      return "url";
    }
    return "text";
  }

  formatValueByDataType(value, newType = '') {
    let dataType = this.detectDataType(value);

    if (newType != '') {
      dataType = newType;
    }

    if (dataType == 'text' && value == null) value = '';
    switch (dataType) {
      case "number":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value);
      case "number-cero":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency', cero: '-', decimales: 0 });
      case "currency":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency' });
      case "currency-cero":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency', cero: '-' });
      case "pesos":
        // Formatear número (decimal) con estilo numérico español
        // return parseFloat(value).toLocaleString('es-ES', { maximumFractionDigits: 2 });
        return formatNumber(value, { type: 'currency', symb: '$' });
      case "datetime-local":
        // Formatear fecha y hora
        const datetime = new Date(value);
        return datetime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
          ' ' + datetime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      case "date":
        // Formatear fecha
        const date = new Date(value + ' 00:00:00');
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      // Agregar más casos según los tipos de datos necesarios
      default:
        return value;
    }
  }

  getDataAll(name) {
    return this.objects[name].midata;
  }

  validations(name) {
    let resultado = true;
    const thisData = this.objects[name].midata;
    for (const fieldName in thisData) {
      if (thisData[fieldName].validate) {
        let value = thisData[fieldName].value;
        let name = thisData[fieldName].name;
        let validate = thisData[fieldName].validate;
        if (!eval(validate)) {
          resultado = false;
          console.log(`El campo ${name} no pasa la validación`)
        }
      }
    }
    return resultado
  }

  removeAll(name) {
    this.objects[name].midata = [];
  }

  capitalize(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  labelCapitalize(name) {
    this.forEachField(name, (field, key) => this.setData(field, 'name', this.capitalize(key.name), name))
  }

  setDefaultRow(name, dataObject) {
    const newObject = {};
    let groupType = {};
    let primaryKey = {};

    if (this.objects[name].structure.length > 0) {
      this.objects[name].structure.forEach(val => {
        groupType[val.column_name] = this.typeToType(val.data_type);
        primaryKey[val.column_name] = val.column_key;
      })
    }

    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';

        if (fieldName in groupType) {
          type = groupType[fieldName];
        }

        if (fieldName in primaryKey) {
          key = primaryKey[fieldName];
        }

        if (type == 'number') {
          value = 0;
        } else {
          value = '';
        }

        newObject[fieldName] = this.createNewObject(fieldName, type, value, key);

      }
    }

    this.objects[name].defaultDataRow = newObject;
  }

  //tables
  loadingBody(name = 'tabla') {
    const thisTable = this.objects[name]?.name;

    let tabla;

    if (!this.objects[name]?.tableElement) {
      tabla = document.querySelector(`#${name}`);
    } else {
      tabla = this.objects[name]?.tableElement;
    }

    const body = tabla.querySelector('tbody');
    const rows = this.objects[name]?.recordsPerView;
    const cols = this.objects[name]?.getCountAtPositionZero();
    let bodyLoading = ''
    body.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      if (i % 2 === 0) {
        bodyLoading += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200/50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200">`;
      } else {
        bodyLoading += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200">`;
      }

      for (let j = 0; j < cols; j++) {
        bodyLoading += `<td class="px-4 py-3 select-none whitespace-nowrap w-10 text-semibold">
          <div class="select-none w-32 h-3 bg-neutral-200 rounded-full dark:bg-neutral-700 animate-pulse"></div>
        </td>`
      }
      bodyLoading += `</tr>`;
    }

    body.innerHTML = bodyLoading;

  }

  loadingTable(name, rows = 2, cols = 5, withHeader = false) {
    let tabla, divContainer;
    let divHeader = '';

    if (this.objects[name]?.loader) {
      if (!this.objects[name]?.tableElement) {
        divContainer = document.querySelector(`#${name}`);
      } else {
        divContainer = this.objects[name]?.tableElement;
      }

      if (withHeader) {
        divHeader = `<div role="status" class="w-full pt-1 pb-4 space-y-4  divide-y divide-neutral-200 rounded animate-pulse dark:divide-neutral-700 ">
        <div class="flex items-center justify-between">
            <div>
                <div class="h-4 bg-neutral-300 rounded-full dark:bg-neutral-600 w-64 mb-2.5"></div>
                <div class="w-32 h-3 bg-neutral-200 rounded-full dark:bg-neutral-700"></div>
            </div>
            <div class="h-8 bg-neutral-300 rounded-full dark:bg-neutral-700 w-52"></div>
        </div>
        <span class="sr-only">Loading...</span>
    </div>`;
      }


      tabla = `${divHeader}
      <div class="overflow-x-auto rounded-lg border border-neutral-400/30 dark:border-neutral-700/50  w-full">
      <table name="table" class="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
      <thead name="thead" class="bg-neutral-400/30 text-neutral-500 dark:text-neutral-600 border-b border-neutral-300 dark:bg-neutral-900/30 dark:border-neutral-600">
      <tr class="text-md font-semibold">`;

      for (let j = 0; j < cols; j++) {
        tabla += `<th scope="col" class="px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap text-left">
          <div class="select-none w-32 h-3 bg-neutral-100 rounded-full dark:bg-neutral-700 "></div>
        </th>`
      }

      tabla += `</tr></thead>
      <tbody>`

      for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
          tabla += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 ">`;
        } else {
          tabla += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 ">`;
        }

        for (let j = 0; j < cols; j++) {
          tabla += `<td class="px-4 py-3 select-none whitespace-nowrap w-10 text-semibold">
            <div class="select-none w-32 h-3 bg-neutral-200 rounded-full dark:bg-neutral-700 animate-pulse"></div>
          </td>`
        }
        tabla += `</tr>`;
      }

      tabla += `</tbody> </table></div>`
      divContainer.innerHTML = tabla;

    }
  }

  buscarYResaltar(componentDiv, name) {
    // Obtén la tabla
    let busqueda = this.objects[name]?.searchValue ? this.objects[name]?.searchValue.toLowerCase() : '';
    const tabla = componentDiv.querySelector('tbody');


    // Recorre las filas de la tabla
    for (var i = 0; i < tabla.rows.length; i++) {
      // Recorre las celdas de cada fila
      for (var j = 0; j < tabla.rows[i].cells.length; j++) {
        // Si el texto de la celda contiene la búsqueda
        let nameCol = tabla.rows[i].cells[j].getAttribute('name');

        let originalText = tabla.rows[i].cells[j].textContent.trim(); // Mantener el texto original
        let value = originalText.toLowerCase();
        if (this.objects[name]?.searchColumns.includes(nameCol)) {
          if (value.includes(busqueda)) {
            // Crear un elemento <span> con la clase y estilos deseados
            let highlightedSpan = document.createElement('span');
            highlightedSpan.classList.add('text-sky-600', 'font-semibold');
            // Encerrar el texto de búsqueda dentro del <span> creado
            let startIndex = value.indexOf(busqueda);
            let endIndex = startIndex + busqueda.length;
            let prefix = originalText.substring(0, startIndex); // Usar el texto original
            let match = originalText.substring(startIndex, endIndex); // Usar el texto original
            let suffix = originalText.substring(endIndex); // Usar el texto original
            let prefixTextNode = document.createTextNode(prefix);
            let matchTextNode = document.createTextNode(match);
            let suffixTextNode = document.createTextNode(suffix);
            highlightedSpan.appendChild(matchTextNode);
            // Reemplazar el contenido de la celda con el nuevo nodo
            tabla.rows[i].cells[j].textContent = ''; // Limpiar el contenido de la celda
            tabla.rows[i].cells[j].appendChild(prefixTextNode);
            tabla.rows[i].cells[j].appendChild(highlightedSpan);
            tabla.rows[i].cells[j].appendChild(suffixTextNode);
          }
        }
      }
    }
  }

  createTable(objOptions, name) {
    const thisTable = this.objects[name];
    const classNames = this.class.table;
    let options;
    let element;

    if (!thisTable.tableElement) {
      element = document.querySelector(`#${name}`);
      thisTable.tableElement = element;
    } else {
      element = thisTable.tableElement;
    }
    if (objOptions) {
      thisTable.tableOptions = objOptions;
      options = objOptions;
    } else {
      options = thisTable.tableOptions;
    }

    let table = ``;
    let tableHeader = ``;
    let count = 0;
    let desde = 0;
    let hasta = 0;
    let recordsPerView = 0;
    let footer = [];
    let header = [];
    let field = {};
    let xRow = {};
    let hayMas = false;
    let hayMenos = false;
    let dataArray = [];
    let miData = {};

    if (options.colorTable) {
      thisTable.changeColorClass(options.colorTable);
    }

    if (thisTable.columns.length > 0) {
      dataArray = this.data[name].map(item => {
        return thisTable.columns.reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            acc[key] = item[key];
          }
          return acc;
        }, {});
      });

      thisTable.columns.forEach(key => {
        if (thisTable.midata.hasOwnProperty(key)) {
          miData[key] = thisTable.midata[key];
        }
      });

    } else {
      dataArray = this.data[name];
      miData = thisTable.midata;
    }

    if (thisTable.searchColumns.length > 0 && thisTable.searchValue) {
      dataArray = dataArray.filter(objeto => {
        return thisTable.searchColumns.some(key => objeto[key].toLowerCase().includes(thisTable.searchValue.toLowerCase()));
      });
    }

    table += `<div class="${classNames.divPadre} ${thisTable.widthPadre}">`;

    if ("title" in options || "subtitle" in options || "btnNew" in options || "buttons" in options) {
      table += `<div name="header" class="${classNames.header}">`;
      if ("title" in options || "subtitle" in options) {
        table += `<div name="titleContainer" class="${classNames.titleContainer}">`;
        if ("title" in options) {
          table += `<h3 name="title" class="${classNames.title}">${options.title}</h3>`;
        }
        if ("subtitle" in options) {
          table += `<p name="subtitle" class="${classNames.subtitle}">${options.subtitle}</p>`;
        }
        table += `</div>`;
      }
      if ("buttons" in options) {
        table += `<div class="${classNames.buttonsContainer}  ${thisTable.widthTable}" >${options.buttons}</div>`;
      }
      if ("btnNew" in options) {
        table += `<button type="button" data-action="seleccionado,0,0" class="${classNames.btnSmall}">${options.btnNew}</button>`;
      }
      table += '</div>';
    }

    table += `<div name="tableContainer" class="${classNames.tableContainer}  ${thisTable.widthTable}">`;
    table += `<table id="tbl_${name}" name="${name}" class="${classNames.table}">`;
    table += `<thead name="thead" class="${classNames.thead}">`;

    tableHeader += `<tr class="${classNames.trtitle}">`;

    if ("row" in options) {
      xRow = options.row;
    }

    desde = thisTable.from > 0 ? thisTable.from : 1;
    recordsPerView = thisTable.recordsPerView;
    hasta = desde + thisTable.recordsPerView - 1;

    Object.keys(miData).forEach(item => {
      let objectItem = miData[item];
      let tipo = this.detectDataType(objectItem.value);
      let xheader = {};
      let xfooter = {};
      let classTitleColumn = '';
      let ColSearch = '';
      let xfield, xname, xattribute, xhidden;

      xattribute = objectItem.attribute ? objectItem.attribute : '';
      xhidden = objectItem.hidden ? 'hidden' : '';

      xname = objectItem.name;

      if (thisTable.searchColumns.includes(item)) {
        ColSearch = '&#9679; '
      }

      if ("header" in options) {
        xheader = options.header[item] ? options.header[item] : {};
      }

      if ("footer" in options) {
        xfooter = options.footer[item] ? options.footer[item] : {};
      }

      if (xattribute) {
        xheader.attribute = xattribute;
        xfooter.attribute = xattribute;
      }

      if (xhidden) {
        xheader.hidden = xhidden;
        xfooter.hidden = xhidden;
      }

      header.push(xheader);
      footer.push(xfooter);

      if ("field" in options) {
        xfield = options.field[item] ? options.field[item] : '';
      } else {
        xfield = '';
      }
      field[item] = xfield;

      if (tipo == 'number') {
        classTitleColumn = 'text-right'
      }

      if ("header" in options) {
        if (options.header[item]) {
          if ('class' in options.header[item]) {
            classTitleColumn = options.header[item].class;
          }
          if ('title' in options.header[item]) {
            xname = options.header[item].title;
          }
        }
      }

      if (tipo == 'number') {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${classNames.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      } else {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${classNames.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      }
    })

    tableHeader += `</tr>`
    table += tableHeader;
    table += `</thead><tbody>`;

    if ("firstRow" in options) {
      table += `<tr>`;
      Object.keys(miData).forEach(item => {
        let tipo = thisTable.detectDataType(miData[item].value);
        let classTitleColumn = '';
        let xfield, xvalue, xattribute, xhidden;

        xattribute = miData[item].attribute ? miData[item].attribute : '';
        xhidden = miData[item].hidden ? 'hidden' : '';

        xvalue = '';

        if ("firstRow" in options) {
          if (options.firstRow[item]) {
            if ('class' in options.firstRow[item]) {
              classTitleColumn = options.firstRow[item].class;
            }
            if ('value' in options.firstRow[item]) {
              xvalue = options.firstRow[item].value;
            }
          }
        }

        table += `<td scope="col" ${xattribute} ${xhidden} class="${classNames.td} ${classTitleColumn}">${xvalue}</td>`;

      })

      table += `</tr>`;
    }

    dataArray.forEach((items, index) => {
      count++;
      if (thisTable.paginations) {
        if ((index + 1) < desde) {
          hayMenos = true;
        } else if ((index + 1) >= desde && (index + 1) <= hasta) {
          let actionClick = '';
          let actionClass = '';
          let trNewClass = '';

          if ('click' in xRow) {
            if (xRow.click.function && xRow.click.field) {
              if (items[xRow.click.field]) {
                actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field]}" `;
                actionClass = classNames.trhover;
              } else {
                console.error('row.click.field: ', `No existe columna ${xRow.click.field} en ${name}`);
              }
            } else {
              console.error('row.click.function', xRow.click.function);
              console.error('row.click.field', xRow.click.field);
            }
          }

          if ('change' in xRow) {
            trNewClass = xRow.change({ items, index });
          }

          if ('alternative' in xRow) {
            if (xRow.alternative == true) {
              if (index % 2 === 0) {
                table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowNormal} ${actionClass} ${trNewClass}">`;
              } else {
                table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowAlternative} ${actionClass} ${trNewClass}">`;
              }
            } else {
              table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowNormal} ${actionClass} ${trNewClass}">`;
            }
          } else {
            table += `<tr ${actionClick} class="${classNames.tr} ${actionClass}">`;
          }

          Object.keys(items).forEach((item, iri) => {
            let xattribute = miData[item].attribute ? miData[item].attribute : '';
            let xhidden = miData[item].hidden ? 'hidden' : '';
            let value = items[item];
            let tipo = miData[item].type;
            let valor = this.formatValueByDataType(value);
            let dataClick = '';
            let newClass = '';
            let mywidth = ''


            if (thisTable.widthColumns.length > 0) {
              mywidth = thisTable.widthColumns[iri];
            }

            if (tipo == 'currency') {
              valor = formatNumberArray(value)[2];
            }

            if (tipo == 'pesos') {
              valor = pesos(value);
            }

            if (field[item].change) {
              valor = field[item].change({ items, valor, index, value });
            }

            if (field[item].click) {
              dataClick = `data-action="${field[item].click}, ${index}, ${value}"`;
            } else {
              dataClick = ``;
            }

            if (field[item].type) {
              tipo = field[item].type
              valor = thisTable.formatValueByDataType(value, tipo);
            }

            if (field[item].class) {
              newClass = mywidth + ' ' + field[item].class;
            } else {
              if (tipo == 'number' || tipo == 'currency' || tipo == 'pesos') {
                newClass = mywidth + ' text-right'
              } else {
                newClass = mywidth;
              }
            }

            table += `<td ${xattribute} ${xhidden} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;

          })
          table += `</tr>`;
        } else if ((index + 1) > hasta) {
          hayMas = true;
        }
      } else {
        let actionClick = '';
        let actionClass = '';
        if ('click' in xRow) {
          if (xRow.click.function && xRow.click.field) {
            actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field].value}" `;
            actionClass = 'cursor-pointer';
          } else {
            console.error('row.click.function', xRow.click.function);
            console.error('row.click.field', xRow.click.field);
          }
        }

        if ('class' in xRow) {
          if ('alternative' in xRow.class) {
            if (index % 2 === 0) {
              table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.normal} ${actionClass}">`;
            } else {
              table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.alternative} ${actionClass}">`;
            }
          } else {
            table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.normal} ${actionClass}">`;
          }
        } else {
          table += `<tr ${actionClick}  class="${classNames.tr} ${actionClass}">`;
        }

        Object.keys(items).forEach((item) => {
          let xattribute = miData[item].attribute ? miData[item].attribute : '';
          let xhidden = miData[item].hidden ? 'hidden' : '';
          let value = items[item];
          let tipo = miData[item].type;
          let valor = this.formatValueByDataType(value);
          let dataClick = '';
          let newClass = '';
          let mywidth = ''

          console.log(tipo, valor)

          if (field[item].change) {
            let resu = field[item].change({ items, valor, index, value });
            console.log(resu)
            valor = resu;
          }

          if (field[item].click) {
            dataClick = `data-action="${field[item].click}, ${index}, ${value}" `;
          } else {
            dataClick = ``;
          }

          if (field[item].class) {
            newClass = field[item].class;
          } else {
            if (tipo == 'number') {
              newClass = 'text-right'
            } else {
              newClass = '';
            }
          }

          if (tipo == 'currency') {
            newClass = 'text-right'
            console.log(tipo, valor)
          }

          if (tipo == 'number') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'date' || tipo == 'datetime-local') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'currency') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          }

        })
        table += `</tr>`;
      }

    });

    table += `</tbody>`;

    if (hayMas == false) {
      table += `<tfoot class="${classNames.tfoot}"><tr class="text-md font-semibold">`
      footer.forEach(ref => {
        let valor = this.formatValueByDataType(ref.value);
        let tipo = this.detectDataType(ref.value);
        let xcss = ref.class ? ref.class : '';
        let xattribute = ref.attribute ? ref.attribute : '';
        let xhidden = ref.hidden ? 'hidden' : '';
        if (tipo == 'number') {
          table += `<td ${xattribute}  class="text-right ${classNames.td} ${xcss}" >${valor}</td>`;
        } else if (tipo == 'date' || tipo == 'datetime-local') {
          table += `<td ${xattribute}  class="${classNames.td} ${xcss}" >${valor}</td>`;
        } else {
          table += `<td ${xattribute}  class="${classNames.td} ${xcss}" >${valor}</td>`;
        }
      })
      table += `</tr>`;
      // if(hayMas){
      // 	table += `<tr><td colspan="${footer.length}" data-tail="td">Hay mas registros</td><tr>`;
      // }
      table += `</tfoot>`;
    }

    table += `</table></div>`;
    table += '</div>';

    if (hayMas || hayMenos) {
      if (count < hasta) {
        hasta = count;
      }
      let buttons = {
        prev: {
          class: classNames.paginationBtn,
          click: `data-pagination="prev"`
        },
        next: {
          class: classNames.paginationBtn,
          click: `data-pagination="next"`
        }
      }

      if (hayMas == true && hayMenos == false) {
        buttons.prev.click = '';
        buttons.prev.class = classNames.paginationBtnDisable;
      } else if (hayMas == false && hayMenos == true) {
        buttons.next.click = '';
        buttons.next.class = classNames.paginationBtnDisable;

      }

      table += `<div id="${name}_pagination" class="${classNames.pagination}">
			<!-- Help text -->
			<span class="text-xs text-neutral-600 dark:text-neutral-400">
					Registro <span class="font-semibold ">${desde}</span> al <span class="font-semibold ">${hasta}</span> (total: <span class="font-semibold">${count}</span> registros)
			</span>
			<div class="inline-flex">
				<!-- Buttons -->
				<button ${buttons.prev.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.prev.class} rounded-l ">
						<svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
						</svg>
						Anterior
				</button>
				<button ${buttons.next.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.next.class} border-0 border-l  rounded-r ">
						Siguiente
						<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
					</svg>
				</button>
			</div>
		</div>`
    }

    element.innerHTML = table;
    this.bindClickPaginations(element, name);
    this.bindActionEvents(element, name)
    this.bindClickEvents(element, name);
    this.bindElementsWithDataValues(element, name);
    this.bindChangeEvents(element, name);
    this.buscarYResaltar(element, name);

    return table;
  }

  updateTable(name) {
    const thisTable = this.objects[name];
    const tableElement = thisTable.tableElement;
    const classNames = this.class.table;
    const options = thisTable.tableOptions;



    if (!tableElement) {
      console.error(`No se encontró la tabla con el nombre '${name}'`);
      return;
    }

    const theTableElement = tableElement.querySelector(`#tbl_${name}`);

    if (!theTableElement) {
      console.error(`No se encontró el cuerpo de la tabla para el nombre '${name}'`);
      return;
    }

    let table = ``;
    let tableHeader = ``;
    let count = 0;
    let desde = 0;
    let hasta = 0;
    let recordsPerView = 0;
    let footer = [];
    let header = [];
    let field = {};
    let xRow = {};
    let hayMas = false;
    let hayMenos = false;
    let dataArray = [];
    let miData = {};

    if (options.colorTable) {
      thisTable.changeColorClass(options.colorTable);
    }

    if (thisTable.columns.length > 0) {
      dataArray = this.data[name].map(item => {
        return thisTable.columns.reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            acc[key] = item[key];
          }
          return acc;
        }, {});
      });

      thisTable.columns.forEach(key => {
        if (thisTable.midata.hasOwnProperty(key)) {
          miData[key] = thisTable.midata[key];
        }
      });

    } else {
      dataArray = this.data[name];
      miData = thisTable.midata;
    }

    if (thisTable.searchColumns.length > 0 && thisTable.searchValue) {
      dataArray = dataArray.filter(objeto => {
        return thisTable.searchColumns.some(key => objeto[key].toLowerCase().includes(thisTable.searchValue.toLowerCase()));
      });
    }




    theTableElement.innerHTML = '';

    table += `<thead name="thead" class="${classNames.thead}">`;

    tableHeader += `<tr class="${classNames.trtitle}">`;

    if ("row" in options) {
      xRow = options.row;
    }

    desde = thisTable.from > 0 ? thisTable.from : 1;
    recordsPerView = thisTable.recordsPerView;
    hasta = desde + thisTable.recordsPerView - 1;


    Object.keys(miData).forEach(item => {
      let objectItem = miData[item];
      let tipo = this.detectDataType(objectItem.value);
      let xheader = {};
      let xfooter = {};
      let classTitleColumn = '';
      let ColSearch = '';
      let xfield, xname, xattribute, xhidden;

      xattribute = objectItem.attribute ? objectItem.attribute : '';
      xhidden = objectItem.hidden ? 'hidden' : '';


      xname = objectItem.name;


      if (thisTable.searchColumns.includes(item)) {
        ColSearch = '&#9679; '
      }

      if ("header" in options) {
        xheader = options.header[item] ? options.header[item] : {};
      }

      if ("footer" in options) {
        xfooter = options.footer[item] ? options.footer[item] : {};
      }

      if (xattribute) {
        xheader.attribute = xattribute;
        xfooter.attribute = xattribute;
      }

      if (xhidden) {
        xheader.hidden = xhidden;
        xfooter.hidden = xhidden;
      }

      header.push(xheader);
      footer.push(xfooter);

      if ("field" in options) {
        xfield = options.field[item] ? options.field[item] : '';
      } else {
        xfield = '';
      }
      field[item] = xfield;

      if (tipo == 'number') {
        classTitleColumn = 'text-right'
      }

      if ("header" in options) {
        if (options.header[item]) {
          if ('class' in options.header[item]) {
            classTitleColumn = options.header[item].class;
          }
          if ('title' in options.header[item]) {
            xname = options.header[item].title;
          }
        }
      }

      if (tipo == 'number') {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${classNames.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      } else {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${classNames.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      }
    })

    tableHeader += `</tr>`
    table += tableHeader;
    table += `</thead><tbody>`;

    if ("firstRow" in options) {
      table += `<tr>`;
      Object.keys(miData).forEach(item => {
        let tipo = thisTable.detectDataType(miData[item].value);
        let classTitleColumn = '';
        let xfield, xvalue, xattribute, xhidden;

        xattribute = miData[item].attribute ? miData[item].attribute : '';
        xhidden = miData[item].hidden ? 'hidden' : '';

        xvalue = '';

        if ("firstRow" in options) {
          if (options.firstRow[item]) {
            if ('class' in options.firstRow[item]) {
              classTitleColumn = options.firstRow[item].class;
            }
            if ('value' in options.firstRow[item]) {
              xvalue = options.firstRow[item].value;
            }
          }
        }


        table += `<td scope="col" ${xattribute} ${xhidden} class="${classNames.td} ${classTitleColumn}">${xvalue}</td>`;



      })

      table += `</tr>`;
    }

    dataArray.forEach((items, index) => {
      count++;
      if (thisTable.paginations) {
        if ((index + 1) < desde) {
          hayMenos = true;
        } else if ((index + 1) >= desde && (index + 1) <= hasta) {
          let actionClick = '';
          let actionClass = '';
          let trNewClass = '';

          if ('click' in xRow) {
            if (xRow.click.function && xRow.click.field) {
              if (items[xRow.click.field]) {
                actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field]}" `;
                actionClass = classNames.trhover;
              } else {
                console.error('row.click.field: ', `No existe columna ${xRow.click.field} en ${name}`);
              }
            } else {
              console.error('row.click.function', xRow.click.function);
              console.error('row.click.field', xRow.click.field);
            }
          }

          if ('change' in xRow) {
            trNewClass = xRow.change({ items, index });
          }

          if ('alternative' in xRow) {
            if (xRow.alternative == true) {
              if (index % 2 === 0) {
                table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowNormal} ${actionClass} ${trNewClass}">`;
              } else {
                table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowAlternative} ${actionClass} ${trNewClass}">`;
              }
            } else {
              table += `<tr ${actionClick} class="${classNames.tr} ${classNames.rowNormal} ${actionClass} ${trNewClass}">`;
            }
          } else {
            table += `<tr ${actionClick} class="${classNames.tr} ${actionClass}">`;
          }


          Object.keys(items).forEach((item, iri) => {
            let xattribute = miData[item].attribute ? miData[item].attribute : '';
            let xhidden = miData[item].hidden ? 'hidden' : '';
            let value = items[item];
            let tipo = miData[item].type;
            let valor = this.formatValueByDataType(value);
            let dataClick = '';
            let newClass = '';
            let mywidth = ''


            if (thisTable.widthColumns.length > 0) {
              mywidth = thisTable.widthColumns[iri];
            }

            if (tipo == 'currency') {
              valor = formatNumberArray(value)[2];
            }

            if (tipo == 'pesos') {
              valor = pesos(value);
            }

            if (field[item].change) {
              valor = field[item].change({ items, valor, index, value });
            }

            if (field[item].click) {
              dataClick = `data-action="${field[item].click}, ${index}, ${value}"`;
            } else {
              dataClick = ``;
            }

            if (field[item].type) {
              tipo = field[item].type
              valor = thisTable.formatValueByDataType(value, tipo);
            }

            if (field[item].class) {
              newClass = mywidth + ' ' + field[item].class;
            } else {
              if (tipo == 'number' || tipo == 'currency' || tipo == 'pesos') {
                newClass = mywidth + ' text-right'
              } else {
                newClass = mywidth;
              }
            }

            table += `<td ${xattribute} ${xhidden} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;


          })
          table += `</tr>`;
        } else if ((index + 1) > hasta) {
          hayMas = true;
        }
      } else {
        let actionClick = '';
        let actionClass = '';
        if ('click' in xRow) {
          if (xRow.click.function && xRow.click.field) {
            actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field]}" `;
            actionClass = 'cursor-pointer';
          } else {
            console.error('row.click.function', xRow.click.function);
            console.error('row.click.field', xRow.click.field);
          }
        }

        if ('class' in xRow) {
          if ('alternative' in xRow.class) {
            if (index % 2 === 0) {
              table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.normal} ${actionClass}">`;
            } else {
              table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.alternative} ${actionClass}">`;
            }
          } else {
            table += `<tr ${actionClick}  class="${classNames.tr} ${xRow.class.normal} ${actionClass}">`;
          }
        } else {
          table += `<tr ${actionClick}  class="${classNames.tr} ${actionClass}">`;
        }

        Object.keys(items).forEach((item) => {
          let xattribute = miData[item].attribute ? miData[item].attribute : '';
          let xhidden = miData[item].hidden ? 'hidden' : '';
          let value = items[item];
          let tipo = miData[item].type;
          let valor = this.formatValueByDataType(value);
          let dataClick = '';
          let newClass = '';
          let mywidth = ''

          console.log(tipo, valor)

          if (field[item].change) {
            let resu = field[item].change({ items, valor, index, value });
            console.log(resu)
            valor = resu;
          }

          if (field[item].click) {
            dataClick = `data-action="${field[item].click}, ${index}, ${value}" `;
          } else {
            dataClick = ``;
          }

          if (field[item].class) {
            newClass = field[item].class;
          } else {
            if (tipo == 'number') {
              newClass = 'text-right'
            } else {
              newClass = '';
            }
          }

          if (tipo == 'currency') {
            newClass = 'text-right'
            console.log(tipo, valor)
          }

          if (tipo == 'number') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'date' || tipo == 'datetime-local') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'currency') {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else {
            table += `<td ${xattribute} name="${item}" class="${classNames.td} ${newClass}" ${dataClick}>${valor}</td>`;
          }

        })
        table += `</tr>`;
      }

    });

    table += `</tbody>`;

    if (hayMas == false) {
      table += `<tfoot class="${classNames.tfoot}"><tr class="text-md font-semibold">`
      footer.forEach(ref => {
        let valor = this.formatValueByDataType(ref.value);
        let tipo = this.detectDataType(ref.value);
        let xcss = ref.class ? ref.class : '';
        let xattribute = ref.attribute ? ref.attribute : '';
        let xhidden = ref.hidden ? 'hidden' : '';
        if (tipo == 'number') {
          table += `<td ${xattribute}  class="text-right ${classNames.td} ${xcss}" >${valor}</td>`;
        } else if (tipo == 'date' || tipo == 'datetime-local') {
          table += `<td ${xattribute}  class="${classNames.td} ${xcss}" >${valor}</td>`;
        } else {
          table += `<td ${xattribute}  class="${classNames.td} ${xcss}" >${valor}</td>`;
        }
      })
      table += `</tr>`;
      // if(hayMas){
      // 	table += `<tr><td colspan="${footer.length}" data-tail="td">Hay mas registros</td><tr>`;
      // }
      table += `</tfoot>`;
    }

    theTableElement.innerHTML = table;
    let divPaginations = document.querySelector(`#${name}_pagination`);
    if (divPaginations) {
      divPaginations.innerHTML = '';
    }

    if (hayMas || hayMenos) {
      if (count < hasta) {
        hasta = count;
      }
      let buttons = {
        prev: {
          class: classNames.paginationBtn,
          click: `data-pagination="prev"`
        },
        next: {
          class: classNames.paginationBtn,
          click: `data-pagination="next"`
        }
      }

      if (hayMas == true && hayMenos == false) {
        buttons.prev.click = '';
        buttons.prev.class = classNames.paginationBtnDisable;
      } else if (hayMas == false && hayMenos == true) {
        buttons.next.click = '';
        buttons.next.class = classNames.paginationBtnDisable;

      }

      divPaginations.innerHTML = `
			<span class="text-xs text-neutral-600 dark:text-neutral-400">
					Registro <span class="font-semibold ">${desde}</span> al <span class="font-semibold ">${hasta}</span> (total: <span class="font-semibold">${count}</span> registros)
			</span>
			<div class="inline-flex">
				<!-- Buttons -->
				<button ${buttons.prev.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.prev.class} rounded-l ">
						<svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
						</svg>
						Anterior
				</button>
				<button ${buttons.next.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.next.class} border-0 border-l  rounded-r ">
						Siguiente
						<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
					</svg>
				</button>
			</div>`
    }

    // Volver a vincular eventos si es necesario
    this.bindClickPaginations(tableElement, name);
    this.bindActionEvents(tableElement, name)
    this.bindClickEvents(tableElement, name);
    this.bindElementsWithDataValues(tableElement, name);
    this.bindChangeEvents(tableElement, name);
    this.buscarYResaltar(tableElement, name);

  }


  bindClickPaginations(componentDiv, name) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-pagination]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-pagination]');
    }

    elementsWithClick.forEach((element) => {
      const action = element.getAttribute('data-pagination');

      element.addEventListener('click', () => {
        let pos = this.objects[name].from;
        let cant = this.objects[name].recordsPerView;

        if (action == 'next') {
          pos = pos + cant;
          this.objects[name].from = pos;
          this.createTable(this.tableOptions, name);

        } else {
          pos = pos - cant;
          this.objects[name].from = pos;
          this.createTable(this.tableOptions, name);

        }
      });

    });
  }

  bindActionEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-action]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-action]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-action');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  reordenarClaves(objeto, orden) {
    const resultado = {};
    orden.forEach((clave) => {
      if (objeto.hasOwnProperty(clave)) {
        resultado[clave] = objeto[clave];
      } else {
        resultado[clave] = this.createNewObject(clave, 'text', ' - ', '');
      }
    });
    return resultado;
  }

  //Formulario
  createForm(data = {}, name) {
    const thisForm = this.objects[name];
    const classNames = this.class.form;
    let element;
    let form = '';
    let groupNav = '';

    let columns = classNames.gridColumns;

    if (thisForm.columns.length > 0) {
      thisForm.midata = this.reordenarClaves(thisForm.midata, thisForm.columns)
    }

    if (!thisForm.formElement) {
      element = document.querySelector(`#${name}`);
      thisForm.formElement = element;
    } else {
      element = thisForm.formElement;
    }

    if ('groupBy' in data) {
      groupNav = `<nav name="navInHeader" class="${classNames.navInHeader}" role="navigation">`;

      data.groupBy.forEach((item, index) => {
        if (index === 0) {
          //buttonNavInHeader
          groupNav += `<button 
          class="tab-btn ${classNames.buttonNavInHeader}"  aria-current="page" data-tab="${name}_tab${index + 1}">${item}</button>`;
        } else {
          groupNav += `<button
          class="tab-btn ${classNames.buttonNavInHeader}" data-tab="${name}_tab${index + 1}">${item}</button>`;
        }
      })

      groupNav += `</nav>`;

    }

    thisForm.formOptions = data;
    let nameForm = name;

    if (data.colorForm) {
      thisForm.changeColorClass(data.colorForm);
    }

    if (thisForm.view != 'normal') {
      thisForm.nameModal = name;

      if (data.show == true) {
        element.classList.add('flex');
      } else {
        element.classList.add('hidden');
      }

      form += `<div id="${name}_mod" tabindex="-1" name="divModal" aria-hidden="true" class="${classNames.divModal}" >`;
      if (thisForm.view == 'modal-full') {
        form += `<div name="modalContainerFull" class="${classNames.modalContainerFull}">`;
      } else {
        form += `<div name="modalContainer" class="${classNames.modalContainer}">`;
      }
      form += `<div name="divPadre" class="${classNames.divPadre}">`;

      form += `<div name="encabezado" class="${classNames.encabezado}">`;

      form += `<div name="header" class="${classNames.header}">`
      form += `<div name="titleContainer" class="${classNames.titleContainer}">`;
      if (data.title) {
        form += `<h3 id="${name}_title" name="title" class="${classNames.title}">${data.title}</h3>`;
      }

      if ("subtitle" in data) {
        form += `<p id="${name}_subtitle" name="subtitle" class="${classNames.subtitle}">${data.subtitle}</p>`;
      }
      form += '</div>'
      if ("buttons" in data) {
        form += `<div class="${classNames.buttonsContainer}">${data.buttons}</div>`;
      }


      form += `<div><button name="btnCloseModal" data-modal="closeModal,${name}" type="button" class="${classNames.btnCloseModal}">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
      </button></div>`

      form += `</div>${groupNav}</div>
      <form data-action="submit" name="${nameForm}"  data-inmodal="${thisForm.nameModal}">`;

    } else {
      form += `<div name="divPadre" class="${classNames.divPadre}">`;

      if ("title" in data || "subtitle" in data || "buttons" in data) {
        form += `<div name="header" class="${classNames.header}">`
        if ("title" in data || "subtitle" in data) {
          form += `<div name="titleContainer" class="${classNames.titleContainer}">`;
          if ("title" in data) {
            form += `<h3 id="${name}_title" name="title" class="${classNames.title}">${data.title}</h3>`;
          }
          if ("subtitle" in data) {
            form += `<p id="${name}_subtitle" name="subtitle" class="${classNames.subtitle}">${data.subtitle}</p>`;
          }
          form += '</div>';
        }

        if ("buttons" in data) {
          form += `${data.buttons}`;
        }
        form += '</div>'

      }

      form += `${groupNav}<form id="form_${nameForm}" name="${nameForm}" data-action="submit">`
    }


    if ("columns" in data) {
      columns = `col-span-12 sm:col-span-${data.columns.sm ?? 6} 
      md:col-span-${data.columns.md ?? 4} 
      lg:col-span-${data.columns.lg ?? 3}`

    }


    form += `<div id="grid_${name}" name="grid" class="${classNames.grid}">`;
    this.forEachField(name, (campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      let colspan = '';
      let esrequired = '';
      let textRequired = '';
      let pattern = '';
      let onChange = '';
      let xClass = '';
      let dataUppercase = '';
      let attributes = '';
      let attributeClass = '';
      let observ = '';


      if (data.bind) {
        dataValue = `data-form="${data.bind}!${campo}"`;
      } else {
        dataValue = `data-form="${thisForm.name}!${campo}"`;
      }

      if (dato.required == true) {
        esrequired = 'required';
        textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
      }

      if (dato.pattern != '') {
        pattern = `pattern="${dato.pattern}"`;
      }

      if (dato.change != '') {
        onChange = `data-onchange="${dato.change}"`;
      }

      if (dato.class != '') {
        xClass = dato.class;
        if (xClass.includes('uppercase')) {
          dataUppercase = 'data-UpperCase="true"';
        }
      }

      if ('column' in dato) {
        if (dato.column != '') {
          colspan = `${dato.column}`
        } else {
          colspan = columns
        }
      } else {
        colspan = columns
      }

      if (dato.observ != '') {
        observ = `&#10509;<small class="${classNames.observ}">${dato.observ}</small>`;
      }

      if (dato.hidden == true) {
        colspan += ' hidden';
      }

      if('groupInput' in data){
        if (dato.field in data.groupInput) {
          colspan += ` tab-content ${name}_tab${data.groupInput[dato.field]} tmn-fadeIn es${data.groupInput[dato.field]}`;
        }
      }

      if (dato.attribute == 'readonly') {
        attributes = 'readonly tabindex="-1"';
        attributeClass = classNames.inputDisable;
      } else if (dato.attribute == 'locked') {
        attributeClass = classNames.input;
        attributes = 'readonly tabindex="-1"';
      } else {
        attributeClass = classNames.input;
        attributes = '';
      }

      if (dato.type === 'select') {
        let haySelected = false;
        let options = dato.options.map(option => {
          if (option.value == dato.value || option.value == dato.defaultValue) {
            if (dato.elegirOpcion == true) {
              return `<option value="${option.value}">${option.label}</option>`
            } else {
              haySelected = true;
              return `<option value="${option.value}" selected>${option.label}</option>`
            }
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        if (!haySelected) {
          options = `<option value="" disabled selected>Elegir...</option>${options}`
          if (!dato.required) {
            esrequired = 'required';
            textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
          }
        }

        fieldElement = `
        <div class="${colspan} ">
          <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
          <select id="${nameForm}_${campo}" ${dataValue} ${onChange} class="${classNames.select} ${xClass}" ${esrequired}>
            ${options}
          </select>
          ${observ}
        </div>`;
      } else if (dato.type === 'datalist') {
        const options = dato.options.map(option => {
          if ((option.value == dato.value && dato.elegirOpcion == false) || option.value == dato.defaultValue) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan} ">
        <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
        <input type="text" autocomplete="off" list="lista-${campo}" ${onChange} id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
          <datalist id="lista-${campo}">
            ${options}
          </datalist>
          ${observ}
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan} ">
            <input type="checkbox" id="${nameForm}_${campo}" ${dataValue} ${onChange} ${esrequired} class="${classNames.checkbox}" ${dato.value ? 'checked' : ''}>
            <label class="${classNames.labelCheckbox}" for="${nameForm}_${campo}">${dato.name} ${textRequired}</label>
          </div>
        `;
      } else if (dato.type === 'textarea') {
        fieldElement = `
          <div class="${colspan} ">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <textarea id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${onChange} ${pattern} ${attributes} rows="${dato.rows}" class="${classNames.textarea} ${xClass}">${dato.value}</textarea>
            ${observ}
          </div>
        `;
      } else if (dato.type === 'currency') {
        fieldElement = `
          <div class="${colspan} ">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="text" autocomplete="off" data-change="currency" id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${formatNumberArray(dato.value)[2]}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      } else if (dato.type === 'upImage') {
        const ffile = this.createInputFile({ name: dato.field, onChange: `${dato.field}_onChange`, classWidth: 'w-full' });
        fieldElement = `
          <div class="${colspan} " ${attributes}>
            ${ffile}
          </div>
        `;
      } else if (dato.type === 'div') {
        fieldElement = `
          <div class="${colspan} " ${attributes}>
            <div id="${dato.name}"></div>
          </div>
        `;
      } else if (dato.type === 'datetime-local') {
        fieldElement = `
          <div class="${colspan} ">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="${dato.type}" autocomplete="off" id="${nameForm}_${campo}" ${dataValue} ${dataUppercase} ${onChange} ${esrequired} ${pattern} value="${formatDate(new Date(dato.value)).fechaHoraLocal}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      } else {

        fieldElement = `
          <div class="${colspan} ">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="${dato.type}" autocomplete="off" id="${nameForm}_${campo}" ${dataValue} ${dataUppercase} ${onChange} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      }

      form += fieldElement;
    });

    form += `</div><div name="footer" class="${classNames.footer}">`;

    if (data.submit || data.delete) {
      form += `<div name="containerButtons" class="${classNames.containerButtons}">`;

      if (data.submit) {
        form += ` <button type="submit" class="${classNames.submit}">${data.submit}</button>`;
      }

      if (data.delete) {
        form += ` <button type="button" data-formclick="delete,${name}" class="${classNames.delete}">${data.delete}</button>`;
      }

      form += `</div>`;
    }
    if (data.inFooter) {
      form += `<div id="${name}_inFooter" class="${classNames.inFooter}"></div>`;
    }

    form += `</div>`;

    if (thisForm.view == 'modal') {
      form += `</form><div id="${name}_before" class=""></div></div></div></div>`
    } else {
      form += '</form><div id="${name}_before" class=""></div>'
    }


    element.innerHTML = form;
    this.bindSubmitEvents(element);
    this.bindFormClickEvent(element);
    this.bindClickEvent(element);
    this.bindClickModal(element);
    this.bindElementsWithDataValues(element);
    this.bindInputFile(element);
    this.bindChangeEvents(element);
    this.bindGroupInputs(element);
    this.functions.onMount(thisForm.name);
    if (thisForm.focus) {
      let elemnetFocus = document.querySelector(`#${nameForm}_${thisForm.focus}`);
      elemnetFocus.focus();
    }
    return form;

  }

  updateForm(name) {
    const thisForm = this.objects[name];
    const classNames = this.class.form;
    const data = thisForm.formOptions;
    const nameForm = name;
    let element;
    let form = '';
    let columns = classNames.gridColumns;
    let groupNav = '';

    if (!thisForm.formElement) {
      element = document.querySelector(`#${thisForm.name}`);
      thisForm.formElement = element;
    } else {
      element = thisForm.formElement;
    }

    let gridForm = element.querySelector(`#grid_${name}`)

    if ("columns" in data) {
      columns = `col-span-12 sm:col-span-${data.columns.sm ?? 6} 
      md:col-span-${data.columns.md ?? 4} 
      lg:col-span-${data.columns.lg ?? 3}`

    }

    if ('groupBy' in data) {
      groupNav = `<nav class="flex" role="navigation">`;

      data.groupBy.forEach((item, index) => {
        if (index === 0) {
          groupNav += `<button class="tab-btn inline-block p-4 border-b-2 rounded-t-lg"  aria-current="page" data-tab="${name}_tab${index + 1}">${item}</button>`;
        } else {
          groupNav += `<button
          class="tab-btn px-4 py-2 bg-neutral-200 text-neutral-600 hover:bg-neutral-300 focus:outline-none focus:ring focus:ring-neutral-300" data-tab="${name}_tab${index + 1}">${item}</button>`;
        }
      })

      groupNav += `</nav>`;

    }


    this.forEachField(name, (campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      let colspan = '';
      let esrequired = '';
      let textRequired = '';
      let pattern = '';
      let onChange = '';
      let xClass = '';
      let dataUppercase = '';
      let attributes = '';
      let attributeClass = '';
      let observ = '';

      if (data.bind) {
        dataValue = `data-form="${data.bind}!${campo}"`;
      } else {
        dataValue = `data-form="${thisForm.name}!${campo}"`;
      }

      if (dato.required == true) {
        esrequired = 'required';
        textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
      }

      if (dato.pattern != '') {
        pattern = `pattern="${dato.pattern}"`;
      }

      if (dato.change != '') {
        onChange = `data-onchange="${dato.change}"`;
      }

      if (dato.class != '') {
        xClass = dato.class;
        if (xClass.includes('uppercase')) {
          dataUppercase = 'data-UpperCase="true"';
        }
      }

      if ('column' in dato) {
        if (dato.column != '') {
          colspan = `${dato.column}`
        } else {
          colspan = columns
        }
      } else {
        colspan = columns
      }

      if (dato.observ != '') {
        observ = `&#10509;<small class="${classNames.observ}">${dato.observ}</small>`;
      }

      if (dato.hidden == true) {
        colspan += ' hidden';
      }

      if('groupInput' in data){
        if (dato.field in data.groupInput) {
          colspan += ` tab-content ${name}_tab${data.groupInput[dato.field]} tmn-fadeIn es${data.groupInput[dato.field]}`;
        }
      }

      if (dato.attribute == 'readonly') {
        attributes = 'readonly tabindex="-1"';
        attributeClass = classNames.inputDisable;
      } else if (dato.attribute == 'locked') {
        attributeClass = classNames.input;
        attributes = 'readonly tabindex="-1"';
      } else {
        attributeClass = classNames.input;
        attributes = '';
      }

      if (dato.type === 'select') {
        let haySelected = false;
        let options = dato.options.map(option => {
          if (option.value == dato.value || option.value == dato.defaultValue) {
            if (dato.elegirOpcion == true) {
              return `<option value="${option.value}">${option.label}</option>`
            } else {
              haySelected = true;
              return `<option value="${option.value}" selected>${option.label}</option>`
            }
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        if (!haySelected) {
          options = `<option value="" disabled selected>Elegir...</option>${options}`
          if (!dato.required) {
            esrequired = 'required';
            textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
          }
        }

        fieldElement = `
        <div class="${colspan}">
          <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
          <select id="${nameForm}_${campo}" ${dataValue} ${onChange} class="${classNames.select} ${xClass}" ${esrequired}>
            ${options}
          </select>
          ${observ}
        </div>`;
      } else if (dato.type === 'datalist') {
        const options = dato.options.map(option => {
          if ((option.value == dato.value && dato.elegirOpcion == false) || option.value == dato.defaultValue) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
        <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
        <input type="text" autocomplete="off" list="lista-${campo}" ${onChange} id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
          <datalist id="lista-${campo}">
            ${options}
          </datalist>
          ${observ}
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan}">
            <input type="checkbox" id="${nameForm}_${campo}" ${dataValue} ${onChange} ${esrequired} class="${classNames.checkbox}" ${dato.value ? 'checked' : ''}>
            <label class="${classNames.labelCheckbox}" for="${nameForm}_${campo}">${dato.name} ${textRequired}</label>
          </div>
        `;
      } else if (dato.type === 'textarea') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <textarea id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${onChange} ${pattern} ${attributes} rows="${dato.rows}" class="${classNames.textarea} ${xClass}">${dato.value}</textarea>
            ${observ}
          </div>
        `;
      } else if (dato.type === 'currency') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="text" autocomplete="off" data-change="currency" id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${formatNumberArray(dato.value)[2]}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      } else if (dato.type === 'upImage') {
        const ffile = this.createInputFile({ name: dato.field, onChange: `${dato.field}_onChange`, classWidth: 'w-full' });
        fieldElement = `
          <div class="${colspan}" ${attributes}>
            ${ffile}
          </div>
        `;
      } else if (dato.type === 'div') {
        fieldElement = `
          <div class="${colspan}" ${attributes}>
            <div id="${dato.name}"></div>
          </div>
        `;
      } else if (dato.type === 'datetime-local') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="${dato.type}" autocomplete="off" id="${nameForm}_${campo}" ${dataValue} ${dataUppercase} ${onChange} ${esrequired} ${pattern} value="${formatDate(new Date(dato.value)).fechaHoraLocal}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      } else {

        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${classNames.label}">${dato.name} ${textRequired}</label>
            <input type="${dato.type}" autocomplete="off" id="${nameForm}_${campo}" ${dataValue} ${dataUppercase} ${onChange} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
            ${observ}
          </div>
        `;
      }

      form += fieldElement;
    });

    gridForm.innerHTML = form;



    if (typeof this.data[name] == 'object') {
      Object.keys(this.data[name]).forEach((key) => {
        let value = this.data[name][key];
        this.updateElementsWithDataValue(`${name}!${key}`, value, name);
      });
    }

    this.bindChangeEvents(element);
    this.bindElementsWithDataValues(element);
    this.bindInputFile(element);
    this.bindGroupInputs(element);
    if (thisForm.focus) {
      let elemnetFocus = element.querySelector(`#${nameForm}_${thisForm.focus}`);
      elemnetFocus.focus();
    }

  }

  forEachField(name, callback) {
    for (const fieldName in this.objects[name].midata) {
      callback(fieldName, this.objects[name].midata[fieldName]);
    }
  }

  setData(fieldName, key, value, name) {
    const thisData = this.objects[name].midata;

    if (thisData[fieldName]) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        thisData[fieldName][key] = parseFloat(value)
      } else {
        thisData[fieldName][key] = value;
        if (value == 'currency') {
          thisData[fieldName].pattern = "[0-9.,]*";
        }
      }
      if (key == 'introDate') {
        let myDate = new Date();
        let days = thisData[fieldName]['setDate'];
        let typeInput = thisData[fieldName]['type'];
        if (days > 0) {
          myDate.setDate(myDate.getDate() + days);
        } else if (days < 0) {
          myDate.setDate(myDate.getDate() - days);
        }

        if (typeInput == 'datetime-local') {
          thisData[fieldName].value = formatDate(myDate).fechaHora;
          this.data[name][fieldName] = formatDate(myDate).fechaHora;
        } else if (typeInput == 'date') {
          thisData[fieldName].value = formatDate(myDate).fecha;
          this.data[name][fieldName] = formatDate(myDate).fecha;
        } else if (typeInput == 'time') {
          thisData[fieldName].value = formatDate(myDate).horaLarga;
          this.data[name][fieldName] = formatDate(myDate).horaLarga;
        }
      }

      if (key == 'value') {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data[name][fieldName] = parseFloat(value);
        } else {
          this.data[name][fieldName] = value;
        }
        this.updateElementsWithDataValue(`${name}!${fieldName}`, value, name)
      }

    }
  }

  setDataKeys(key, objectNameValue, name) {
    Object.keys(objectNameValue).forEach((val) => {
      if (this.objects[name].midata[val]) {
        this.objects[name].midata[val][key] = objectNameValue[val];
      }
    })
  }

  getData(fieldName, key, name) {
    if (this.objects[name].midata[fieldName]) {
      return this.objects[name].midata[fieldName][key];
    }
    return undefined;
  }

  setDataFromModel(objeto, name) {
    const objectModel = convertirFormatoFecha(objeto)
    const thisObject = this.objects[name];
    let miData = {};
    let newObject = {};

    if (thisObject.columns.length > 0) {
      thisObject.columns.forEach(key => {
        if (thisObject.midata.hasOwnProperty(key)) {
          miData[key] = thisObject.midata[key];
          newObject[key] = objectModel[key];
        }
      });
    } else {
      miData = thisObject.midata;
      newObject = objectModel;
    }

    Object.keys(newObject).forEach((fieldName) => {
      let value = newObject[fieldName];

      if (miData[fieldName]) {
        if (miData[fieldName].type == 'number' || miData[fieldName].type == 'select') {
          if (!isNaN(parseFloat(value)) && isFinite(value)) {
            miData[fieldName].value = parseFloat(value)
          } else {
            miData[fieldName].value = value;
          }
        } else {
          miData[fieldName].value = value;
        }

      } else {
        console.error('No existe ', fieldName, value)
      }


    })
  }

  setDataObject(objeto, name) {
    const objectModel = new Object(convertirFormatoFecha(objeto))
    const thisObject = this.objects[name];
    let miData = {};
    let newObject = {};

    if (thisObject.columns.length > 0) {
      thisObject.columns.forEach(key => {
        if (thisObject.midata.hasOwnProperty(key)) {
          miData[key] = thisObject.midata[key];
          newObject[key] = objectModel[key];
        }
      });
    } else {
      miData = thisObject.midata;
      newObject = objectModel;
    }

    for (const prop in newObject) {
      if (newObject.hasOwnProperty(prop) && this.objects[name].midata.hasOwnProperty(prop)) {
        this.objects[name].midata[prop].value = newObject[prop];
        if (!isNaN(parseFloat(newObject[prop])) && isFinite(newObject[prop])) {
          this.data[name][prop] = parseFloat(newObject[prop]);
        } else {
          this.data[name][prop] = newObject[prop];
        }
        this.updateElementsWithDataValue(`${name}!${prop}`, newObject[prop], name);

      } else {
        console.warn(`Key '${prop}' does not exist in this.objects.${name}.midata`);
      }
    }


  }

  bindSubmitEvents(componentDiv) {
    let forms;
    if (componentDiv) {
      forms = componentDiv.querySelectorAll('form[data-action]');
    } else {
      forms = document.querySelectorAll('form[data-action]');
    }

    forms.forEach((form) => {
      const functionName = form.getAttribute('data-action');
      let modalName = '';

      if (form.getAttribute('data-inmodal')) {
        modalName = form.getAttribute('data-inmodal');
        this.modalName = modalName;
      }

      form.addEventListener('submit', async (event) => {
        let name = event.target.name
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario  
        this.executeFunctionByName(functionName, event, name)

      });

      form.addEventListener('keypress', function (event, element) {
        // Verificamos si la tecla presionada es "Enter" (código 13)
        if (event.keyCode === 13) {
          // Prevenimos la acción predeterminada (envío del formulario)
          // event.preventDefault();

          // Obtenemos el elemento activo (el que tiene el foco)
          const elementoActivo = document.activeElement;

          if (elementoActivo.type == 'submit') {
            event.preventDefault();
            elementoActivo.click();
          } else if (elementoActivo.type == 'textarea') {
            // let textus = elementoActivo.value;
            // textus = textus.replace(/\n/g, '\\n');
            // console.log(textus)
          } else {
            event.preventDefault();
            // Obtenemos la lista de elementos del formulario
            // const elementosFormulario = form.elements;
            const elementosFormulario = Array.from(form.elements).filter(elemento => !elemento.readOnly);


            // Buscamos el índice del elemento activo en la lista
            const indiceElementoActivo = Array.prototype.indexOf.call(elementosFormulario, elementoActivo);

            // Movemos el foco al siguiente elemento del formulario
            const siguienteElemento = elementosFormulario[indiceElementoActivo + 1];
            if (siguienteElemento) {
              siguienteElemento.focus();
            }

          }

        }
      });
    });
  }

  bindClickModal(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-modal]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-modal]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-modal');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindFormClickEvent(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-formclick]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-formclick]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-formclick');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindClickEvent(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  cleanTextForFile(frase) {
    // Remover todos los signos de puntuación y reemplazar espacios con "_"
    frase = frase.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_");
    // Remover saltos de línea
    frase = frase.replace(/[\n\r]/g, "");
    // Convertir a minúsculas
    frase = frase.toLowerCase();
    return frase;
  }

  getElementValue(elementoId) {
    // Obtener el elemento del DOM por su ID
    const elemento = document.getElementById(elementoId);

    // Verificar si se encontró un elemento con el ID proporcionado
    if (elemento) {
      // Determinar el tipo de elemento y obtener su valor
      switch (elemento.tagName.toLowerCase()) {
        case 'input':
        case 'textarea':
        case 'select':
          // Para input, textarea y select, simplemente devolvemos su valor
          return elemento.value;
        case 'p':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          // Para párrafos y títulos, devolvemos el texto dentro del elemento
          return elemento.textContent;
        default:
          // En caso de otros tipos de elementos, devolvemos null o algún mensaje de error
          return null;
      }
    } else {
      // Si no se encuentra el elemento, devolvemos null o algún mensaje de error
      return null;
    }
  }

}