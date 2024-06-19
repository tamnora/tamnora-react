import { Tooltip } from "../Tooltip";
import { DeleteIcon } from "./DeleteIcon";
import { DetailsIcon } from "./DetailsIcon";
import { EditIcon } from "./EditIcon";

export const TableActions = ({
  showDetails = true,
  showEdit = true,
  showDelete = true,
  onDetailsClick = () => { },
  onEditClick = () => { },
  onDeleteClick = () => { },
}) => {
  return (
    <div className="relative flex items-center gap-2 w-[65px] justify-center">
      {showDetails && (
        <Tooltip content="Detalles">
          <span
            className="text-lg text-zinc-400 cursor-pointer active:opacity-50"
            onClick={onDetailsClick}>
            <DetailsIcon />
          </span>
        </Tooltip>
      )}
      {showEdit && (
        <Tooltip content="Editar">
          <span
            className="text-lg text-zinc-400 cursor-pointer active:opacity-50"
            onClick={onEditClick}>
            <EditIcon />
          </span>
        </Tooltip>
      )}
      {showDelete && (
        <Tooltip content="Eliminar" color="danger">
          <span
            className="text-lg text-red-500 cursor-pointer active:opacity-50"
            onClick={onDeleteClick}>
            <DeleteIcon />
          </span>
        </Tooltip>
      )}
    </div>
  );
};