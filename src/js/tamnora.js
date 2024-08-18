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

export function formatTime(valor = '') {
  if (valor === '') return { horaEs: '' };

  let myTime;
  if (typeof valor === 'string') {
    const exp = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!exp.test(valor)) return { horaEs: '' };
    myTime = valor;
  } else if (valor instanceof Date) {
    myTime = valor.toTimeString().slice(0, 8);
  } else {
    return { horaEs: '' };
  }

  const [horas, minutos] = myTime.split(':');

  return {
    horaEs: `${horas}:${minutos}`,
    // ... (puedes agregar aquí más propiedades si lo deseas)
  };
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

export function separeStructure(structure) {
  const types = {};
  const keys = {};
  const primary = {};

  if (structure.length > 0) {
    structure.forEach(val => {
      let name = val.COLUMN_NAME.toLowerCase()
      types[name] = typeToType(val.DATA_TYPE);
      keys[name] = val.COLUMN_KEY;
      if(val.COLUMN_KEY != ''){
        primary['key'] = name;
      }
    })
  } 

  return { types, keys, primary };
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

export async function runCodeStruc(codeSQL, table){
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
      const tableStructure = await setStructure(table);
      objResult.struc = separeStructure(tableStructure);
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

export async function runQuery(server_url, server_type, type, sql) {
  let datos = {
    tipo: type.charAt(0),
    tsql: codeTSQL(sql)
  };

  try {
    let resp;
    if (server_type == 'php') {
      resp = await fetch(`${server_url}/tsql.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${server_url}/tsql`, {
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

let objects = {
  id: 0,
  key: '',
  type: 'form',
  view: 'normal',
  focus: '',
  table: '',
  midata: { form: 'Faltan cargar datos al formulario' },
  columns: [],
  structure: [],
  camposOrden: {},
  formElement: '',
  formOptions: {},
  numberAlert: 0,
  updateIdSelected: false,
  resetOnSubmit: false,
}


function formatoDeCeros(valor) {
  return valor < 10 ? `0${valor}` : valor;
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

function createQuerySQL(type, params) {
  //console.log(types, params)
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

function prepararSQL(tabla, json, selectID = '', updateID = false) {
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
              if (json[key].noData == false) {
                  if (json[key].key == 'PRI' || json[key].key == 'pri') {
                      typeInput = json[key].type;
                      hayKey = true;
                      let valueKey = json[key].value;
                      // console.log(selectID);
                      if (selectID != null) {
                          if (typeInput == 'integer' || typeInput == 'number') {
                              if (json[key].value > 0) {
                                  elValor = parseFloat(json[key].value);
                              } else {
                                  elValor = json[key].value;
                              }
                          } else {
                              elValor = `${json[key].value}`;
                          }

                          if (elValor && updateID) {
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

          // console.log('Primer Paso',dataForSave);
          // console.log('tipoSQL', tipoSQL)
          // console.log(tabla, where)

          sql = createQuerySQL(tipoSQL, {
              t: tabla,
              w: where,
              d: dataForSave
          });

          // console.log('Segundo Paso', sql);

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

function detectDataType(value) {
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

function createNewObject(fieldName, type, value, key) {
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

function handleDataObject(dataObject, groupType, primaryKey, clean = false) {
  const newObject = {};
  const newObjectClean = {};

  for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
          let value = dataObject[fieldName];
          let type = detectDataType(value);
          let key = '';
          let cleanValue = '';

          if (type === 'datetime') {
              value = formatDate(new Date(value)).fechaHora;
          }

          if (clean) {
              if (type === 'number') {
                  value = 0;
              } else {
                  value = '';
              }
          } else {
              if (value == null) {
                  value = '';
              }
          }

          if (type === 'number') {
              cleanValue = 0;
          } else {
              cleanValue = '';
          }

          if (fieldName in groupType) {
              type = groupType[fieldName];
          }

          if (fieldName == primaryKey) {
              // key = primaryKey[fieldName];
              key = 'PRI'
          }

          newObjectClean[fieldName] = cleanValue;
          newObject[fieldName] = createNewObject(fieldName, type, value, key);
      }
  }

  return newObject;
}

function addObject(obj, struc, primaryKey, clean = false) {
  const dataObject = new Object(convertirFormatoFecha(obj))

  const newObject = handleDataObject(dataObject, struc, primaryKey, clean);
  objects.midata = newObject;
}

export const objToSQL = (obj, table, struc, primaryKey, idSelected, actualizaId = false) => {
  let query = {};
  objects.table = table;
  objects.id = idSelected;
  objects.updateIdSelected = actualizaId;
  addObject(obj, struc, primaryKey)
  query = prepararSQL(objects.table, objects.midata, objects.id, actualizaId)

  return query;
};