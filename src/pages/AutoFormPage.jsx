import React, { useState, useEffect } from 'react';
import { AutoForm } from '../components/ui';
import { Card, CardHeader, CardBody } from '../components/ui';
import { runCodeStruc } from '../services/apiService';
import { useToast } from '../hooks/useToast';

const AutoFormPage = () => {
  const [datos, setDatos] = useState({});
  const [struc, setStruc] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idSelected, setIdSelected] = useState(0);
  const [resEval, setResEval] = useState(false);
  const { showToast } = useToast();
  
  // Ejemplo de datos para el formulario
  const names = {
    viaje_id: 'ID',
    fecha: 'Fecha',
    hora: 'Hora',
    status: 'Estado',
    lugar: 'Destino',
    observ: 'Observaciones',
    asignado: 'Móvil Asignado',
    parada: 'Punto de Partida',
    nro: 'Número',
    hora_asig: 'Hora Asignación',
    hora_comp: 'Hora Completo'
  };
  
  const tipos = {
    status: {
      type: 'select',
      options: [
        { value: 0, label: 'Pendiente' },
        { value: 1, label: 'En Progreso' },
        { value: 2, label: 'Completado' },
        { value: 3, label: 'Cancelado' }
      ]
    },
    fecha: { type: 'date' },
    hora: { type: 'time' },
    hora_asig: { type: 'time' },
    hora_comp: { type: 'time' },
    asignado: { type: 'number' },
    observ: { type: 'textarea' }
  };
  
  const widthColumns = {
    viaje_id: 'col-span-1',
    fecha: 'col-span-2',
    hora: 'col-span-2',
    status: 'col-span-2',
    lugar: 'col-span-5',
    observ: 'col-span-12',
    asignado: 'col-span-2',
    parada: 'col-span-4',
    nro: 'col-span-2',
    hora_asig: 'col-span-2',
    hora_comp: 'col-span-2'
  };
  
  // Función para obtener los datos
  const traerDatos = async () => {
    setLoading(true);
    try {
      const resultado = await runCodeStruc(
        '-sl viaje_id, fecha, hora, status, lugar -fr viajes -wr status < 2 -ob viaje_id DESC',
        'viajes', 
        'viaje_id'
      );
      setDatos(resultado.data);
      setStruc(resultado.struc.types);
    } catch (err) {
      setError(err.message || 'Error al traer datos');
      showToast({
        message: 'Error al cargar datos: ' + (err.message || 'Error desconocido'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    traerDatos();
  }, []);

  const guardarDatos = async (data) => {
    try {
      // Aquí iría el código para guardar los datos
      console.log('Datos a guardar:', data);
      showToast({
        message: 'Datos guardados correctamente',
        type: 'success'
      });
      await traerDatos(); // Recargar datos
    } catch (error) {
      showToast({
        message: 'Error al guardar: ' + (error.message || 'Error desconocido'),
        type: 'error'
      });
    }
  };

  const eliminarDatos = async (id) => {
    try {
      // Aquí iría el código para eliminar/cancelar un viaje
      console.log('ID a eliminar/cancelar:', id);
      showToast({
        message: 'Viaje cancelado correctamente',
        type: 'success'
      });
      await traerDatos(); // Recargar datos
    } catch (error) {
      showToast({
        message: 'Error al cancelar viaje: ' + (error.message || 'Error desconocido'),
        type: 'error'
      });
    }
  };

  const cancelar = () => {
    setIdSelected(0);
    // Otras acciones al cancelar
  };

  const evaluaMovil = (data) => {
    if (data.value < 50) {
      setResEval(true);
      return { className: 'text-red-500', message: 'Móvil no disponible' };
    } else {
      setResEval(false);
      return { className: 'text-green-500', message: 'Móvil disponible' };
    }
  };

  const onUpdateInput = {
    lugar: (data) => {
      console.log('Lugar actualizado:', data.value);
      // Lógica adicional al actualizar el campo lugar
    }
  };

  const hiddenInputs = () => {
    // Ejemplo de lógica para ocultar campos según alguna condición
    return idSelected === 0 ? ['hora_asig', 'hora_comp'] : [];
  };

  const isMobile = () => {
    return window.innerWidth < 768;
  };

  const onMessage = error ? 
    <div className="text-red-500 text-sm mt-2">{error}</div> :
    loading ? 
      <div className="text-blue-500 text-sm mt-2">Cargando datos...</div> : 
      null;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo de AutoForm</h1>
      
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Gestión de Viajes</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">Cargando formulario...</div>
          ) : (
            <AutoForm 
              data={datos}
              idSelected={idSelected}
              primaryKey='viaje_id'
              struc={struc}
              types={tipos}
              names={names}
              table='viajes'
              formVariant='tmn'
              inputVariant='tmn'
              inputText='text-base'
              inputOutline='default'
              inputRadius='rounded-lg'
              labelPlacement='inside'
              onCancel={cancelar}
              onSubmit={guardarDatos}
              onDelete={eliminarDatos}
              colorSubmit='yellow'
              onUpdateInput={onUpdateInput}
              onChangeInput={{ asignado: evaluaMovil }}
              evaluteInput={{ asignado: { result: resEval } }}
              propsPlus={{ asignado: { min: 0 } }}
              onMessage={onMessage}
              placeholder={{ observ: 'Agregue una observación aquí' }}
              isReadOnly={['viaje_id', 'fecha', 'hora', 'status', 'hora_asig', 'hora_comp']}
              isRequired={['nro', 'parada']}
              isHidden={hiddenInputs()}
              isUpperCase={['lugar', 'observ']}
              inputTextClass={{
                lugar: 'text-yellow-600 font-semibold',
                asignado: 'text-yellow-600 font-semibold',
                completado: 'text-sky-600 dark:text-sky-500 font-semibold'
              }}
              textDelete='Cancelar Viaje'
              msgButtonDelete='Confirmar: Cancelar Viaje?'
              textCancel='Cerrar'
              buttonVariant='solid'
              focusIn='lugar'
              focusActive={!isMobile()}
              colsWidth={widthColumns}
              footerClass='flex items-center justify-between gap-2 mt-2 pt-5 border-t border-zinc-300 dark:border-zinc-600'
            />
          )}
        </CardBody>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Documentación del Componente</h2>
        <div className="prose max-w-none">
          <h3>Descripción</h3>
          <p>
            El componente AutoForm de tamnora-react es un formulario altamente configurable 
            que permite generar formularios dinámicos a partir de un objeto de datos.
          </p>
          
          <h3>Características principales</h3>
          <ul>
            <li>Tipos de campos configurables</li>
            <li>Múltiples opciones de diseño</li>
            <li>Validación integrada</li>
            <li>Callbacks personalizados</li>
            <li>Pie de página con acciones personalizables</li>
          </ul>
          
          <h3>Ejemplo de uso</h3>
          <p>
            En esta página se muestra un ejemplo completo de implementación del componente AutoForm
            para gestionar viajes, con diferentes tipos de campos, validaciones y eventos personalizados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoFormPage;
