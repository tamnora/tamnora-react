import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from './Textarea';
import { Input } from './Input';
import { InputCurrency } from './InputCurrency'
import { Select } from './Select';
import { Button } from './Button';
import { InputCurrency2 } from './InputCurrency2';

const AutoForm = ({
	idSelected,
	updateIdSelected = false,
	data,
	name = 'form',
	struc,
	table,
	types = {},
	names = {},
	focusIn = '',
	variant = 'default',
	inputRadius = 'rounded-xl',
	inputVariant = 'faded',
	labelPlacement = 'inside',
	onCancel,
	onDelete,
	onSubmit,
	onChange,
	isRequired = {},
	isReadOnly = {},
	isDisabled = {},
	hiddenFields = [],
	primaryKey = {},
	widthColumns = {},
	onUpdateInput = {},
	isCase = {},
	textSubmit = 'Guardar',
	textDelete = 'Eliminar',
	textCancel = 'Cancelar',
	mostrarSubmit = true,
	mostrarDelete = true,
	mostarCancel = true,
}) => {
	const [formData, setFormData] = useState({ ...data });
	const [initialValues, setInitialValues] = useState({ ...data });
	const formRef = useRef(null);
	const fieldRefs = useRef({});
	const [refreshForm, setRefreshForm] = useState(1)

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
	};

	const handleSelect = (key, value) => {
		let updatedData = { ...formData, [key]: value };
		setFormData(updatedData);

		if(onChange){
			onChange(updatedData);
		}
	}

	const handleFocus = (e, key) => {
		setInitialValues({
			...initialValues,
			[key]: e.target.value,
		});
	};

	const handleBlur = (e, key) => {
		if (initialValues[key] !== e.target.value) {
			initialValues[key] = e.target.value;
			let updatedData = { ...formData, [key]: e.target.value };
			if (key in onUpdateInput) {
				let res = onUpdateInput[key](formData, e.target.value);
				if(res){
					setRefreshForm(0);
					updatedData = { ...updatedData, ...res };
					console.log('Resultado', updatedData)
					setFormData(updatedData);	
				}
			}

			if(onChange){
				onChange(updatedData);
			}
		}
	};

	const handleChangeCurrency = (e, key) => {
		if (initialValues[key] !== e.target.value) {
			let newValue = formatNumberArray(e.target.value);
			setFormData({
				...formData,
				[key]: newValue[0],
			});
			// console.log(newValue, key);
			e.target.value = newValue[2];
			if (key in onUpdateInput) {
				onUpdateInput[key](formData, newValue[0])
			}
		}
	};

	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			let typeElement = document.activeElement.tagName.toLowerCase();
			const formElements = Array.from(formRef.current.elements);
			const index = formElements.indexOf(document.activeElement);
			if (typeElement != 'button') {
				e.preventDefault();
				if (index > -1 && index < formElements.length - 1) {
					formElements[index + 1].focus();
				}
			} else {
				if (document.activeElement.name === 'submit') {
					handleSubmit();
				}
				if (document.activeElement.name === 'delete') {
					onDelete();
				}
				if (document.activeElement.name === 'cancel') {
					onCancel();
				}
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
		setDeleteText('Seguro que desea eliminar?')
		if(deleteConfirmed){
			onDelete();
		}
		setDeleteConfirmed(!deleteConfirmed)

	};

	
	const footerClasses = `flex items-center justify-between gap-2 border-zinc-300 dark:border-zinc-600
	${variant === 'tmn' && 'border-t pt-4'}
	`

	useEffect(() => {
		setFormData({ ...data });
	}, [data]);

	useEffect(()=>{
		setRefreshForm(1);
	},[formData])

	useEffect(() => {
		if (focusIn && fieldRefs.current[focusIn]) {
			fieldRefs.current[focusIn].focus(); // Enfoca el campo correspondiente a `focusIn`
		} else {
			formRef.current.elements[0].focus();
		}
	}, [focusIn]);

	return (
		<form name={name} ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
			<div className="grid grid-cols-12 gap-2 pb-4 tmn-fadeIn">
				{refreshForm && Object.keys(formData).map((key) => {
					const fieldType = types[key]?.type || struc[key] || 'text';

					if (!hiddenFields.includes(key)) {
						return (
							<div key={key} className={`${widthColumns[key] || 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'}`}>
								{fieldType === 'select' && (
									<Select
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										options={types[key].options}
										label={names[key] || key}
										defaultValue={formData[key]}
										onChange={(value) => handleSelect(key, value)}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false}
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
										defaultValue={formData[key]}
										isRequiredMessage="Campo requerido"
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isCase={isCase[key] || ''}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false} />
								)}
								{fieldType === 'date' && (
									<Input
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										type={fieldType}
										defaultValue={formData[key]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false} />
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
										defaultValue={formData[key]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false}
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
										defaultValue={formatNumberArray(formData[key])[2]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false}
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
										defaultValue={formData[key]}
										onChange={(e) => handleChange(e, key)}
										onHandleBlur={(e) => handleBlur(e, key)}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false} />
								)}
								{fieldType === 'checkbox' && (
									<div className='flex pt-4 ml-2 justify-start align-center'>
										<input
											id={`${name}_${key}`}
											type={fieldType}
											defaultValue={formData[key]}
											onChange={(e) => handleChange(e, key)}
											onFocus={(e) => handleFocus(e, key)}
											onBlur={(e) => handleBlur(e, key)}
											isReadOnly={isReadOnly[key] || false}
											isRequired={isRequired[key] || false}
											isDisabled={isDisabled[key] || false}
										/>
										<label htmlFor={`${name}_${key}`}>{types[key].label || key}</label>
									</div>
								)}
								{fieldType === 'textarea' && (
									<Textarea
										label={names[key] || key}
										labelPlacement={labelPlacement}
										radius={inputRadius}
										variant={inputVariant}
										id={`${name}_${key}`}
										onChange={(e) => handleChange(e, key)}
										isCase={isCase[key] || ''}
										isReadOnly={isReadOnly[key] || false}
										isRequired={isRequired[key] || false}
										isDisabled={isDisabled[key] || false}
										rows={types[key].rows || 2}
										defaultValue={formData[key]} />
								)}
							</div>
						);
					}
					return null;
				})}
			</div>
			{onSubmit && (
				<div className={footerClasses}>
					<div className="flex items-center justify-start gap-2">
						
						{mostrarSubmit && (
							<Button radius='rounded-xl'  type="submit" name='submit' color='sky'>
								{textSubmit}
							</Button>
						)}
						{mostrarDelete && onDelete && idSelected > 0 && (
							<Button radius='rounded-xl' color='red' type="button" name='delete' onClick={handleDelete}>
								{deleteText}
							</Button>
						)}
						{ mostarCancel && onCancel && (
							<Button radius='rounded-xl' color='zinc' type="button" name='cancel' onClick={onCancel}>
								{textCancel}
							</Button>
						)}
					</div>
				</div>
			)}
		</form>
	);
};

export { AutoForm };