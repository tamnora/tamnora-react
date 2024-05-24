import React, { useState, useRef, useEffect } from 'react';

const AutoForm = ({ name = 'form', data, primaryKey = {}, struc, onSubmit, onDelete, onCancel, focusIn = '', names = {}, types = {}, readOnly = {}, widthColumns = {}, onUpdateInput = {}, id, table }) => {
	const [formData, setFormData] = useState({ ...data });
	const formRef = useRef(null);
	const fieldRefs = useRef({});

	let classInput = '';
	let objects = {
		midata: { form: 'Faltan cargar datos al formulario' },
		formOptions: {},
		table: table ?? '',
		type: 'form',
		view: 'normal',
		key: '',
		focus: '',
		id: id ?? 0,
		columns: [],
		camposOrden: {},
		numberAlert: 0,
		resetOnSubmit: false,
		structure: [],
		formElement: '',
		modalName: '',
	}

	function formatoDeCeros(valor) {
		return valor < 10 ? `0${valor}` : valor;
	}

	function formatNumberArray(str, dec = 2) {
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

	function prepararSQL(tabla, json, selectID = '') {
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

				if (fieldName in primaryKey) {
					key = primaryKey[fieldName];
				}

				newObjectClean[fieldName] = cleanValue;
				newObject[fieldName] = createNewObject(fieldName, type, value, key);
			}
		}

		return newObject;
	}

	function addObject(obj, clean = false) {
		const dataObject = new Object(convertirFormatoFecha(obj))

		const newObject = handleDataObject(dataObject, struc, primaryKey, clean);
		objects.midata = newObject;
	}

	const handleChange = (e, key) => {
		setFormData({
			...formData,
			[key]: e.target.value,
		});
		
		// console.log(e, key);
	};

	const handleBlur = (e, key) => {
		if(key in onUpdateInput){
			onUpdateInput[key](formData, e.target.value)
		}
		// console.log(e, key);
	};

	const handleChangeCurrency = (e, key) => {
		let newValue = formatNumberArray(e.target.value);
		setFormData({
			...formData,
			[key]: newValue[0],
		});
		// console.log(newValue, key);
		e.target.value = newValue[2];
		if(key in onUpdateInput){
			onUpdateInput[key](formData, newValue[0])
		}

	};

	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();

			const formElements = Array.from(formRef.current.elements);
			const index = formElements.indexOf(document.activeElement);
			if (index > -1 && index < formElements.length - 1) {
				formElements[index + 1].focus();
			}
		}
	};

	const handleSubmit = (e) => {
		let sql = {};
		e.preventDefault();
		addObject(formData)
		if(table){
			sql = prepararSQL(objects.table, objects.midata, objects.id)
		}
		
		onSubmit({ formData, sql });
	};

	const classNames = {
		divPadre: `relative container mx-auto max-w-screen-lg bg-neutral-100/70 text-neutral-700 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 px-4 py-6 rounded-lg shadow-none tmn-fadeIn`,
		modalContainer: `relative w-full max-w-3xl bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg max-h-screen overflow-y-auto tmn-fadeIn transition-all duration-700 ease-in-out`,
		modalContainerFull: `relative w-full h-full max-h-screen overflow-y-auto bg-neutral-100 dark:bg-neutral-800 p-6 tmn-fadeIn transition-all duration-700 ease-in-out`,
		modalContainer2xl: `relative w-full max-w-2xl max-h-full bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg tmn-fadeIn transition-all duration-700 ease-in-out`,
		encabezado: `flex flex-col border-b rounded-t border-neutral-300 dark:border-neutral-700`,
		header: `flex flex-col items-start sm:flex-row sm:justify-between sm:items-center px-2 pb-3 rounded-t`,
		grid: `grid grid-cols-12 gap-2 pb-6 h-full`,
		navInHeader: `flex w-full text-sm text-neutral-500 dark:text-neutral-500 border-b rounded-t border-neutral-200 dark:border-neutral-700`,
		buttonNavInHeader: `inline-block px-4 py-2 rounded-t-lg hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-300`,
		footer: `flex items-center justify-between pt-4 gap-2 border-t border-neutral-300 dark:border-neutral-600`,
		inFooter: `flex items-center justify-end gap-2`,
		gridColumns: `col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`,
		titleContainer: `flex flex-col w-full `,
		buttonsContainer: `flex gap-1 w-full justify-end`,
		title: `text-lg font-medium text-left text-neutral-600 dark:text-white leading-none`,
		subtitle: `mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight`,
		observ: `mt-1 ml-1 text-sm font-normal italic text-neutral-500 dark:text-neutral-500 leading-tight`,
		label: `flex items-center gap-1 pl-1 text-xs font-semibold text-neutral-500 dark:text-neutral-500`,
		input: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500  block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
		isCurrency: `flex bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus-within:outline-none focus-within:ring-sky-500 focus-within:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus-within:ring-sky-700 dark:focus-within:border-sky-700`,
		isCurrencyDisable: `flex bg-neutral-100 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus-within:outline-none focus-within:ring-yellow-500 focus-within:border-yellow-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus-within:ring-yellow-700 dark:focus-within:border-yellow-700`,
		labelCurrency: `inline-flex items-center pr-1 text-sm text-neutral-600 bg-transparent  dark:text-neutral-200 `,
		labelCurrencyDisable: `inline-flex items-center child pl-1 text-sm text-neutral-300 bg-transparent  dark:text-neutral-500 focus:outline-none focus:ring-sky-500`,
		inputCurrency: `inline-flex items-center pr-1 text-sm text-neutral-600 bg-transparent  dark:text-neutral-200 focus:outline-none focus:ring-sky-500`,
		inputCurrencyDisable: `inline-flex items-center child pl-1 text-sm text-neutral-300 bg-transparent  dark:text-neutral-500 focus:outline-none focus:ring-none`,
		textarea: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 whitespace-pre-line`,
		labelCheckbox: `flex items-center gap-1 pl-1 text-xs font-semibold text-neutral-500 dark:text-neutral-500`,
		checkbox: `w-4 h-4 text-blue-600 bg-white border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600`,
		inputDisable: `bg-neutral-100 border border-neutral-300 text-neutral-400 text-sm rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-neutral-500 dark:focus:ring-yellow-700 dark:focus:border-yellow-700`,
		select: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
		containerButtons: `flex items-center justify-start gap-4`,
		submit: '!m-0 flex capitalize items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-sky-600 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 focus:bg-sky-500 hover:bg-sky-700 active:translate-y-0.5 transition-all duration-100 active:bg-sky-700 scale-95 focus:scale-100 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center',
		delete: '!m-0 flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-red-600 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 focus:bg-red-500 hover:bg-red-700 active:translate-y-0.5 transition-all duration-100 active:bg-red-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-red-800/80 text-center',
		cancel: '!m-0 flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-neutral-600 shadow-lg shadow-neutral-600/30 hover:shadow-neutral-600/50 focus:bg-neutral-500 hover:bg-neutral-700 active:translate-y-0.5 transition-all duration-100 active:bg-neutral-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-neutral-800/80 text-center',
	};

	const renderForm = () => {
		return (
			<form name={name} ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
				<div className={classNames.grid}>
					{Object.keys(formData).map((key) => {
						const fieldType = types[key]?.type || struc[key] || 'text';

						if (key !== primaryKey) {
							return (
								<div key={key} className={`${widthColumns[key] || classNames.gridColumns}`}>
									<label className={classNames.label}>{names[key] || key}</label>
									{fieldType === 'select' && (
										<select
											id={`${name}_${key}`}
											ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
											className={readOnly[key] ? classNames.inputDisable : classNames.select}
											defaultValue={formData[key]}
											onChange={(e) => handleChange(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											readOnly={readOnly[key] || false}
										>
											{(types[key].options || []).map((option) => {
												const selec = formData.key == option.value ? 'selected' : '';
												return (
													<option key={option.value} value={option.value} select={selec}>
														{option.label}
													</option>
												)
											})}
										</select>
									)}
									{fieldType === 'text' && (
										<input
											id={`${name}_${key}`}
											ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
											type={fieldType}
											className={readOnly[key] ? classNames.inputDisable : classNames.input}
											defaultValue={formData[key]}
											onChange={(e) => handleChange(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											readOnly={readOnly[key] || false}
										/>
									)}
									{fieldType === 'date' && (
										<input
											id={`${name}_${key}`}
											ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
											type={fieldType}
											className={readOnly[key] ? classNames.inputDisable : classNames.input}
											defaultValue={formData[key]}
											onChange={(e) => handleChange(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											readOnly={readOnly[key] || false}
										/>
									)}
									{fieldType === 'currency' && (
										<div className={readOnly[key] ? classNames.isCurrencyDisable : classNames.isCurrency}>
											<span className={readOnly[key] ? classNames.labelCurrencyDisable : classNames.labelCurrency}>
												<svg
													fill="currentColor"
													viewBox="0 0 16 16"
													className="w-4 h-4"
												>
													<path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
												</svg>
											</span>
											<input
												id={`${name}_${key}`}
												ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
												type={fieldType}
												className={readOnly[key] ? classNames.inputCurrencyDisable : classNames.inputCurrency}
												defaultValue={formatNumberArray(formData[key])[2]}
												onBlur={(e) => handleChangeCurrency(e, key)}
												readOnly={readOnly[key] || false}
											/>
										</div>
									)}
									{fieldType === 'number' && (
										<input
											id={`${name}_${key}`}
											ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
											type={fieldType}
											className={readOnly[key] ? classNames.inputDisable : classNames.input}
											defaultValue={formData[key]}
											onChange={(e) => handleChange(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											readOnly={readOnly[key] || false}
										/>
									)}
									{fieldType === 'checkbox' && (
										<div className='flex pt-4 ml-2 justify-start align-center'>
											<input
												id={`${name}_${key}`}
												ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
												type={fieldType}
												className={readOnly[key] ? classNames.inputDisable : classNames.checkbox}
												defaultValue={formData[key]}
												onChange={(e) => handleChange(e, key)}
												onBlur={(e) => handleBlur(e, key)}
												readOnly={readOnly[key] || false}
											/>
											<label htmlFor={`${name}_${key}`} className={classNames.labelCheckbox}>{types[key].label || key}</label>
										</div>
									)}
									{fieldType === 'textarea' && (
										<textarea
											id={`${name}_${key}`}
											ref={(el) => (fieldRefs.current[key] = el)} // Asigna la referencia
											onChange={(e) => handleChange(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											readOnly={readOnly[key] || false}
											rows={types[key].rows || 2}
											className={readOnly[key] ? classNames.inputDisable : classNames.input}
											defaultValue={formData[key]}
										/>
									)}
								</div>
							);
						}
						return null;
					})}
				</div>
				{onSubmit && (
					<div className={classNames.footer}>
						<div className={classNames.containerButtons}>
							<button type="submit" className={classNames.submit}>
								Submit
							</button>
							{onDelete && (
								<button type="button" onClick={onDelete} className={classNames.delete}>
									Delete
								</button>
							)}
							{onCancel && (
								<button type="button" onClick={onCancel} className={classNames.cancel}>
									Cancel
								</button>
							)}
						</div>
					</div>
				)}
			</form>
		);
	};

	useEffect(() => {
		setFormData({ ...data });
	}, [data]);

	useEffect(() => {
		if (focusIn && fieldRefs.current[focusIn]) {
			fieldRefs.current[focusIn].focus(); // Enfoca el campo correspondiente a `focusIn`
		} else {
			formRef.current.elements[0].focus();
		}
	}, [focusIn]);

	return (
		<div className={classNames.divPadre}>
			{renderForm()}
		</div>
	);
};

export { AutoForm };
