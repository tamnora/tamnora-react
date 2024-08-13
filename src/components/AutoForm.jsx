import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from './Textarea';
import { Input } from './Input';
import { InputCurrency } from './InputCurrency'
import { Select } from './Select';
import { Button } from './Button';
import { InputCurrency2 } from './InputCurrency2';
import { Switch } from './Switch';
import { Checkbox } from './Checkbox';
import { InputToggle } from './InputToggle';
import { InputOptions } from './InputOptions';
import { InputAutocomplete } from './InputAutocomplete';
import { InputSpace } from './InputSpace';
import { InputFormat } from './InputFormat';

const AutoForm = ({
	idSelected,
	updateIdSelected = false,
	data,
	name = 'form',
	struc = {},
	table,
	types = {},
	names = {},
	focusIn = '',
	formVariant = 'default',
	inputRadius = 'rounded-xl',
	inputVariant = 'faded',
	labelPlacement = 'inside',
	footerClass,
	onCancel,
	onDelete,
	onSubmit,
	onChange,
	isRequired = [],
	isReadOnly = [],
	isDisabled = [],
	isHidden = [],
	primaryKey = '',
	colsWidth = {},
	onUpdateInput = {},
	onChangeInput = {},
	evaluteInput = {},
	onMessage,
	isUpperCase = [],
	isLowerCase = [],
	inputTextClass = {},
	inputColorClass = {},
	propsPlus = {},
	placeholder = {},
	buttonVariant = 'solid',
	buttonSize = 'md',
	textSubmit = 'Guardar',
	textDelete = 'Eliminar',
	msgButtonDelete = "Confirmación: Eliminar",
	textCancel = 'Cancelar',
	colorSubmit = 'sky',
	colorDelete = 'zinc',
	colorCancel = 'zinc',
	showSubmit = true,
	showDelete = true,
	showCancel = true,
}) => {
	const [formData, setFormData] = useState({ ...data });
	const [initialValues, setInitialValues] = useState({ ...data });
	const formRef = useRef(null);
	const fieldRefs = useRef({});
	const [inputUpdated, setInputUpdated] = useState(false);
	const [submitColor, setSubmitColor] = useState(colorSubmit);
	const [deleteColor, setDeleteColor] = useState(colorDelete);
	const [cancelColor, setCancelColor] = useState(colorCancel);
	



	function isObject(variable) {
		return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
	}


	if (isObject(data) == false) return (
		<div className={`flex flex-col items-center justify-center gap-4 text-lg text-zinc-700 dark:text-zinc-200 w-full h-64 bg-black/10 dark:bg-white/10 rounded-xl  animate-pulse`}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-500">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
			</svg>
			¡El formato de los datos del formulario no es el correcto!
		</div>
	);

	let objects = {
		id: idSelected ?? 0,
		key: '',
		type: 'form',
		view: 'normal',
		focus: '',
		table: table ?? '',
		midata: { form: 'Faltan cargar datos al formulario' },
		columns: [],
		structure: [],
		camposOrden: {},
		formElement: '',
		formOptions: {},
		numberAlert: 0,
		resetOnSubmit: false,
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

		let numeroFinal = '';
		let resultado = [];
		let parteEntera = '';
		let parteDecimal = '';
		let numero = str.replace(/[^0-9.,]/g, '');
		let numeroReal = numero;
		let negativo = str.startsWith('-', 0);
		let arrayNumero = numero.replace(/[.,]/g, ',').split(',');
		let ultimoValor = arrayNumero.length - 1;

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

								if (elValor && updateIdSelected) {
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

	function addObject(obj, clean = false) {
		const dataObject = new Object(convertirFormatoFecha(obj))

		const newObject = handleDataObject(dataObject, struc, primaryKey, clean);
		objects.midata = newObject;
	}

	function formatTime(valor = '') {
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
	

	const handleChange = (e, key) => {
		let updatedData = { ...formData, [key]: e.target.value };
		setFormData(updatedData);
		
		if(!inputUpdated){
			setInputUpdated(true);
		}

		if (onChange) {
			onChange(updatedData);
		}

		if (key in onChangeInput) {
			let res = onChangeInput[key]({ formData: formData, key: key, value: e.target.value, ref: formRef });
			if (res) {
				updatedData = { ...updatedData, ...res };
				// console.log('Resultado', updatedData)
				setFormData(updatedData);
			}
		}
	};

	const handleSelect = (key, value) => {
		let updatedData = { ...formData, [key]: value };
		setFormData(updatedData);

		if (onChange) {
			onChange(updatedData);
		}
	}

	
	const handleBlur = (e, key) => {
		if (initialValues[key] != e.target.value || inputUpdated) {
			initialValues[key] = e.target.value;
			setInputUpdated(false);
			let updatedData = { ...formData, [key]: e.target.value };
			if (key in onUpdateInput) {
				let res = onUpdateInput[key]({ formData: formData, key: key, value: e.target.value, ref: formRef });
				if (res) {
					updatedData = { ...updatedData, ...res };
					// console.log('Resultado', updatedData)
					setFormData(updatedData);
				}
			}

			if (onChange) {
				onChange(updatedData);
			}
		}
	};

	
	const handleKeyPress = (e) => {
		if (data) {
			if (e.ctrlKey && e.keyCode === 13) {
				e.preventDefault();
				
				const formElements = Array.from(formRef.current.elements);
				formElements.forEach(element => {
					if(element.id === `${name}_submit`){
						showSubmit && element.focus();
					}
				});
				
			} else if (e.keyCode === 13) {
				let typeElement = document.activeElement.tagName.toLowerCase();
				const formElements = Array.from(formRef.current.elements);
				const index = formElements.indexOf(document.activeElement);
				if (typeElement != 'button') {
					e.preventDefault();
					let nextIndex = index + 1;
					while (nextIndex < formElements.length && formElements[nextIndex].tabIndex === -1) {
						nextIndex++;
					}
					if (nextIndex < formElements.length) {
						formElements[nextIndex].focus();
						const typeNextElement = formElements[nextIndex].tagName.toLowerCase();
						if (typeNextElement == 'input') {
							formElements[nextIndex].select();
						}
					}
				} else {
					const role = document.activeElement.role || '';
					if (role === 'switch' || role === 'select') {
						e.preventDefault();
						let nextIndex = index + 1;
						while (nextIndex < formElements.length && formElements[nextIndex].tabIndex === -1) {
							nextIndex++;
						}
						if (nextIndex < formElements.length) {
							formElements[nextIndex].focus();
							const typeNextElement = formElements[nextIndex].tagName.toLowerCase();
							if (typeNextElement == 'input') {
								formElements[nextIndex].select();
							}
						}
					}
				}
			} else if (e.ctrlKey && e.key === 'd') {
				e.preventDefault();
				
				const formElements = Array.from(formRef.current.elements);
				formElements.forEach(element => {
					if(element.id === `${name}_delete`){
						showDelete && onDelete && idSelected > 0 && element.focus();
					}
				});
				
			} else if (e.ctrlKey && e.key === 'g') {
				e.preventDefault();
				
				const formElements = Array.from(formRef.current.elements);
				formElements.forEach(element => {
					if(element.id === `${name}_submit`){
						showSubmit && element.focus();
					}
				});
				
			} 
		}
	};


	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		let query = {};
		addObject(formData)
		if (table) {
			query = prepararSQL(objects.table, objects.midata, objects.id)
		}
		onSubmit({ formData, query });
	};


	const [deleteText, setDeleteText] = useState(textDelete)
	const [deleteConfirmed, setDeleteConfirmed] = useState(false)

	const handleDelete = (e) => {
		setDeleteText(msgButtonDelete);
		setDeleteColor('red');
		if (deleteConfirmed) {
			onDelete();
		}
		setDeleteConfirmed(!deleteConfirmed)

	};

	const handleCancel = (e) => {
		onCancel()
	}



	const footerDefaultClass = `flex items-center justify-start gap-2 border-zinc-300 dark:border-zinc-600 ${formVariant === 'tmn' && 'border-t mt-2 pt-6'}`
	const footerClasses = `${footerClass ? footerClass : footerDefaultClass}`

	useEffect(() => {
		setFormData({ ...data });
	}, [data]);

	
	useEffect(() => {
		if (data) {
			if (focusIn && fieldRefs.current[focusIn]) {
				fieldRefs.current[focusIn].focus();
			} else {
				const formElements = Array.from(formRef.current.elements);
				const firstFocusableElement = formElements.find(element =>
					element.tabIndex !== -1 &&
					!element.disabled &&
					!element.readOnly
				);
				if (firstFocusableElement) {
					firstFocusableElement.focus();
				}
			}
		}
	}, [focusIn, data]);

	if (!data) return (
		<div className={`flex flex-col items-center justify-center gap-4 text-lg text-zinc-700 dark:text-zinc-200 w-full h-64 bg-black/10 dark:bg-white/10 rounded-xl  animate-pulse`}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-500">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
			</svg>
			Formulario: ¡No hay datos cargados!
		</div>
	);

	return (
		<form name={name} ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
			<div className={`grid grid-cols-12 gap-2 pb-4 tmn-fadeIn ${formVariant === 'daf' && 'shadow-lg p-3'}`}>
				{formData && Object.keys(formData).map((key) => {
					const fieldType = types[key]?.type || struc[key] || 'text';

					if (!isHidden.includes(key)) {
						return (
							<div key={key} className={`${colsWidth[key] || 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'}`}>
								{fieldType === 'select' && (
									<Select
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										options={types[key].options}
										label={names[key] || key}
										placeholder={placeholder[key] || ''}
										defaultValue={formData[key] || ''}
										onChange={(value) => handleSelect(key, value)}
										isReadOnly={isReadOnly.includes(key) || false}
										isRequired={isRequired.includes(key) || false}
										isDisabled={isDisabled.includes(key) || false}
									/>
								)}
								{fieldType === 'text' && (
									<Input
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key]  || ''}
										textClass={inputTextClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										placeholder={placeholder[key] || ''}
										color={inputColorClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)} 
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'number' && (
									<Input
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key] || ''}
										placeholder={placeholder[key] || ''}
										color={inputColorClass[key]}
										textClass={inputTextClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)} 
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'inputspace' && (
									<InputSpace
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type='text'
										defaultValue={formData[key]  || ''}
										textClass={inputTextClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										placeholder={placeholder[key] || ''}
										color={inputColorClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										options={types[key].options}
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'inputformat' && (
									<InputFormat
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type='text'
										defaultValue={formData[key]  || ''}
										textClass={inputTextClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										placeholder={placeholder[key] || ''}
										color={inputColorClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										regex={types[key].regex || /[^a-zA-Z0-9]/g}
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'date' && (
									<Input
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key] || ''}
										textClass={inputTextClass[key]}
										color={inputColorClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)} 
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'time' && (
									<Input
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formatTime(formData[key]).horaEs}
										textClass={inputTextClass[key]}
										color={inputColorClass[key]}
										evalActive={evaluteInput[key]? true : false}
										evalResult={evaluteInput[key]?.result}
										evalColorTrue={evaluteInput[key]?.colorTrue}
										evalColorFalse={evaluteInput[key]?.colorFalse}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)} 
										{...propsPlus[key]}
										/>
								)}
								{fieldType === 'currency' && (
									// 		onBlur={(e) => handleChangeCurrency(e, key)}
									<InputCurrency
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key] || 0}
										textClass={inputTextClass[key]}
										color={inputColorClass[key]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										{...propsPlus[key]}
									/>
								)}
								{fieldType === 'currency2' && (
									// 		onBlur={(e) => handleChangeCurrency(e, key)}
									<InputCurrency2
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formatNumberArray(formData[key] || 0)[2]}
										textClass={inputTextClass[key]}
										color={inputColorClass[key]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										{...propsPlus[key]}
									/>
								)}
								{fieldType === 'checkbox' && (
									<Checkbox
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										defaultValue={formData[key] || 0}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
									/>
								)}
								{fieldType === 'switch' && (
									<Switch
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										color='emerald'
										id={`${name}_${key}`}
										defaultValue={formData[key]  || 0}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										inOn={types[key].options ? types[key].options.on : ''}
										inOff={types[key].options ? types[key].options.off : ''}
									/>
								)}
								{fieldType === 'toggle' && (
									<InputToggle
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type='text'
										defaultValue={formData[key] || 0}
										textClass={inputTextClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										textOn={types[key].options ? types[key].options.on : ''}
										textOff={types[key].options ? types[key].options.off : ''}
									/>
								)}
								{fieldType === 'option' && (
									<InputOptions
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type='text'
										defaultValue={formData[key] || ''}
										placeholder={placeholder[key] || ''}
										textClass={inputTextClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										options={types[key].options}
									/>
								)}
								{fieldType === 'autocomplete' && (
									<InputAutocomplete
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key] || ''}
										placeholder={placeholder[key] || ''}
										textClass={inputTextClass[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)} 
										options={types[key].options}
										/>
								)}
								{fieldType === 'textarea' && (
									<Textarea
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										onChange={(e) => handleChange(e, key)}
										isUpperCase={isUpperCase.includes(key)}
										isLowerCase={isLowerCase.includes(key)}
										isReadOnly={isReadOnly.includes(key)}
										isRequired={isRequired.includes(key)}
										isDisabled={isDisabled.includes(key)}
										rows={types[key].rows || 2}
										defaultValue={formData[key] || ''}
										placeholder={placeholder[key] || ''} 
										{...propsPlus[key]}
										/>	
								)}
							</div>
						);
					}
					return null;
				})}
			</div>
			{onMessage && (
				<div className="">
					{onMessage}
				</div>
			)}
			{onSubmit && (
				<div className={footerClasses}>

					{showSubmit && (
						<Button radius='rounded-xl' color={submitColor} id={`${name}_submit`} type="submit" name='submit' variant={buttonVariant} size={buttonSize} >
							{textSubmit}
						</Button>
					)}
					{showDelete && onDelete && idSelected > 0 && (
						<Button radius='rounded-xl' color={deleteColor} id={`${name}_delete`} type="button" name='delete' variant={buttonVariant} size={buttonSize} onClick={handleDelete}>
							{deleteText}
						</Button>
					)}
					{showCancel && onCancel && (
						<Button radius='rounded-xl' color={cancelColor} id={`${name}_cancel`} type="button" name='cancel' variant={buttonVariant} size={buttonSize} onClick={handleCancel}>
							{textCancel}
						</Button>
					)}
				</div>
			)}
		</form>
	);
};

export { AutoForm };