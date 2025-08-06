import { Object } from '@/components/UI/resource';
import { usePaintedGrid } from '@/hook/common';
import { useReservationActions } from '@/hook/dashboard';
import { typeResource } from '@/ultils';
import { useState } from 'react';
import { TableItem } from '..';

export const MapState = ({
   rows,
   columns,
   resources,
   filter,
   selectedResource,
   onOpenReserveTable,
}) => {
   const [highlightedTableIds, setHighlightedTableIds] = useState([]);

   const {
      handleCancelReserveWithToast,
      confirmReservationWithToast,
      releaseReservationWithToast,
      unblockTempTableWithToast,
      blockTempTableWithToast
   } = useReservationActions()

   const handleCancelReserve = (table) => {
      handleCancelReserveWithToast({
         table,
         setHighlightedTableIds
      });
   }

   const handleBlockTempTable = (table) => {
      blockTempTableWithToast({
         table,
         filter
      })
   }

   const handleUnblockTempTable = (table) => {
      unblockTempTableWithToast({
         table,
         filter
      })
   }

   const handleConfirmReservation = (table) => {
      confirmReservationWithToast(
         table.reservation
      )
   }

   const handleReleaseReservation = (table) => {
      releaseReservationWithToast(
         table.reservation
      )
   }

   const paintedBoard = usePaintedGrid({
      rows: rows,
      columns: columns,
      resources,
      renderResource: (resource, style) => {
         switch (resource.type) {
            case typeResource.TABLE:
               return <div key={resource.id} style={style}>
                  <TableItem
                     key={'table-' + resource.id}
                     table={resource}
                     onCancelReserve={handleCancelReserve}
                     onBlockTempTable={handleBlockTempTable}
                     onOpenReserveTable={onOpenReserveTable}
                     onUnblockTempTable={handleUnblockTempTable}
                     onConfirmReservation={handleConfirmReservation}
                     onReleasedReservation={handleReleaseReservation}
                     highlighted={
                        highlightedTableIds.includes(resource.id) ||
                        selectedResource?.id === resource.id
                     }
                  />
               </div>
            case typeResource.OBJECT:
               return <div key={resource.id} style={style}>
                  <Object
                     object={resource}
                  />
               </div>
            default:
               break;
         }
      },
      renderEmptyCell: (x, y) => <div key={`empty-node-${x}-${y}`} />
   })

   return (
      <>
         {paintedBoard}
      </>
   )
}