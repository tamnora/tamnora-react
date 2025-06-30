

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

export async function runCode(input, server = 'http://localhost:2212/run-code') {
  if (typeof input !== 'string') {
    throw new Error('La entrada debe ser una cadena de texto');
}

  try {
     const resp = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: input })
      });
    

    const result = await resp.json();
    return result;

  } catch (error) {
    console.error('Error: ' + error.message);
    return [{ resp: 'error', msgError: error.message }];
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

export function formatDate(value = null, separador = '-') {
  if (value == null) return null
  let valor = String(value);
  let myDate;
  let sep = separador || '-';

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

  if (value instanceof Date) { // ¡Condición más específica para objetos Date!
    myDate = value;
  } else if (typeof value == 'string') { // Manejo de cadenas como antes
    let valor = String(value); // Mantener la conversión a String aquí
    let exp = /^\d{2,4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}$/gm;
    let exp2 = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/gm;

    if (valor.match(exp)) {
      myDate = new Date(valor);
    } else if (valor.match(exp2)) {
      myDate = new Date(`${valor} 00:00:00`);
    } else {
      return 'El valor es incorrecto';
    }
  } else {
    return 'parametro incorrecto';
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

export function toggleClass(element, initialClass, finalClass) {
  if (element.classList.contains(initialClass)) {
    element.classList.remove(initialClass);
    element.classList.add(finalClass);
  } else {
    element.classList.remove(finalClass);
    element.classList.add(initialClass);
  }
}


export function inputColor(color = 'default'){
  const colorMap = {
    default: {
      flat: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700',
      bordered: 'border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      underlined: 'border-b-2 !shadow-none dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 !px-1',
      faded: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
      tmn: 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500',
    },
    blue: {
      flat: 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700',
      bordered: 'border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
      underlined: 'border-b-2 !shadow-none dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 !px-1',
      faded: 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
      tmn: 'bg-white dark:bg-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-800/50 border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500',
    },
    red: {
      flat: 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700',
      bordered: 'border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
      underlined: 'border-b-2 !shadow-none dark:border-red-700 hover:border-red-400 dark:hover:border-red-500 !px-1',
      faded: 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
      tmn: 'bg-red-100 text-red-700 dark:bg-red-800/80 hover:bg-red-50 dark:hover:bg-red-800/50 border border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500',
    },
    green: {
      flat: 'bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700',
      bordered: 'border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
      underlined: 'border-b-2 !shadow-none dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 !px-1',
      faded: 'bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
      tmn: 'bg-white dark:bg-green-800/80 hover:bg-green-50 dark:hover:bg-green-800/50 border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500',
    },
    yellow: {
      flat: 'bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700',
      bordered: 'border-2 border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
      underlined: 'border-b-2 !shadow-none dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 !px-1',
      faded: 'bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 border-2 border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
      tmn: 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500',
    },
    sky: {
      flat: 'bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700',
      bordered: 'border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
      underlined: 'border-b-2 !shadow-none dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500 !px-1',
      faded: 'bg-sky-100 dark:bg-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
      tmn: 'bg-white dark:bg-sky-800/80 hover:bg-sky-50 dark:hover:bg-sky-800/50 border border-sky-200 dark:border-sky-700 hover:border-sky-400 dark:hover:border-sky-500',
    },
    emerald: {
      flat: 'bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700',
      bordered: 'border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
      underlined: 'border-b-2 !shadow-none dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 !px-1',
      faded: 'bg-emerald-100 dark:bg-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-700 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
      tmn: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-800/50 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500',
    },
    violet: {
      flat: 'bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700',
      bordered: 'border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
      underlined: 'border-b-2 !shadow-none dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500 !px-1',
      faded: 'bg-violet-100 dark:bg-violet-800 hover:bg-violet-200 dark:hover:bg-violet-700 border-2 border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
      tmn: 'bg-white dark:bg-violet-800/80 hover:bg-violet-50 dark:hover:bg-violet-800/50 border border-violet-200 dark:border-violet-700 hover:border-violet-400 dark:hover:border-violet-500',
    },
    purple: {
      flat: 'bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700',
      bordered: 'border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
      underlined: 'border-b-2 !shadow-none dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 !px-1',
      faded: 'bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
      tmn: 'bg-white dark:bg-purple-800/80 hover:bg-purple-50 dark:hover:bg-purple-800/50 border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500',
    },
    orange: {
      flat: 'bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700',
      bordered: 'border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
      underlined: 'border-b-2 !shadow-none dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 !px-1',
      faded: 'bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
      tmn: 'bg-white dark:bg-orange-800/80 hover:bg-orange-50 dark:hover:bg-orange-800/50 border border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500',
    },
    amber: {
      flat: 'bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700',
      bordered: 'border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
      underlined: 'border-b-2 !shadow-none dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 !px-1',
      faded: 'bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 border-2 border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
      tmn: 'bg-white dark:bg-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-800/50 border border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500',
    },
    lime: {
      flat: 'bg-lime-100 dark:bg-lime-800 hover:bg-lime-200 dark:hover:bg-lime-700',
      bordered: 'border-2 border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
      underlined: 'border-b-2 !shadow-none dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500 !px-1',
      faded: 'bg-lime-100 dark:bg-lime-800 hover:bg-lime-200 dark:hover:bg-lime-700 border-2 border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
      tmn: 'bg-white dark:bg-lime-800/80 hover:bg-lime-50 dark:hover:bg-lime-800/50 border border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500',
    },
    teal: {
      flat: 'bg-teal-100 dark:bg-teal-800 hover:bg-teal-200 dark:hover:bg-teal-700',
      bordered: 'border-2 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
      underlined: 'border-b-2 !shadow-none dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500 !px-1',
      faded: 'bg-teal-100 dark:bg-teal-800 hover:bg-teal-200 dark:hover:bg-teal-700 border-2 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
      tmn: 'bg-white dark:bg-teal-800/80 hover:bg-teal-50 dark:hover:bg-teal-800/50 border border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500',
    },
  };

  return colorMap[color];

}

export function inputOutline(color = 'default'){
  const typesOutlines = {
    default: 'outline outline-zinc-600/50 dark:outline-zinc-100/50 outline-offset-0',
    blue: 'outline outline-blue-500 dark:outline-blue-700 outline-offset-0',
    red: 'outline outline-red-500 dark:outline-red-700 outline-offset-0',
    green: 'outline outline-green-500 dark:outline-green-700 outline-offset-0',
    yellow: 'outline outline-yellow-500 dark:outline-yellow-700 outline-offset-0 focus:border-yellow-500 dark:focus:border-yellow-700',
    sky: 'outline outline-sky-500 dark:outline-sky-700 outline-offset-0',
    emerald: 'outline outline-emerald-500 dark:outline-emerald-700 outline-offset-0',
    violet: 'outline outline-violet-500 dark:outline-violet-700 outline-offset-0',
    purple: 'outline outline-purple-500 dark:outline-purple-700 outline-offset-0',
    orange: 'outline outline-orange-500 dark:outline-orange-700 outline-offset-0',
    amber: 'outline outline-amber-500 dark:outline-amber-700 outline-offset-0',
    lime: 'outline outline-lime-500 dark:outline-lime-700 outline-offset-0',
    teal: 'outline outline-teal-500 dark:outline-teal-700 outline-offset-0',
  };

  const typesBorders = {
    default: 'outline-none focus:border-zinc-700 dark:focus:border-zinc-500',
    blue: 'outline-none focus:border-blue-500 dark:focus:border-blue-700',
    red: 'outline-none focus:border-red-500 dark:focus:border-red-700',
    green: 'outline-none focus:border-green-500 dark:focus:border-green-700',
    yellow: 'outline-none focus:border-yellow-500 dark:focus:border-yellow-700',
    sky: 'outline-none focus:border-sky-500 dark:focus:border-sky-700',
    emerald: 'outline-none focus:border-emerald-500 dark:focus:border-emerald-700',
    violet: 'outline-none focus:border-violet-500 dark:focus:border-violet-700',
    purple: 'outline-none focus:border-purple-500 dark:focus:border-purple-700',
    orange: 'outline-none focus:border-orange-500 dark:focus:border-orange-700',
    amber: 'outline-none focus:border-amber-500 dark:focus:border-amber-700',
    lime: 'outline-none focus:border-lime-500 dark:focus:border-lime-700',
    teal: 'outline-none focus:border-teal-500 dark:focus:border-teal-700',
};


  return typesOutlines[color];

}