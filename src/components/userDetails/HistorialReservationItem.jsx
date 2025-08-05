import { cn, DateFormat, typeStatusTable } from '@/ultils';
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, OctagonX, Pen, Unlink2, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Card, CardContent, Tooltip, TooltipContent, TooltipTrigger } from '../UI/common';

export const HistorialReservationItem = ({
   reservation,
   onEditReservetion,
   onCancelReservation,
   onConfirmReservation,
   onReleasedReservation,
   isLoading = false,
}) => {
   const [isExpanded, setIsExpanded] = useState(false);

   const toggleExpanded = () => {
      setIsExpanded(!isExpanded)
   }

   const renderContent = () => {
      switch (reservation.status) {
         case typeStatusTable.PENDING:
            return (
               <>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           onClick={() => onCancelReservation(reservation)}
                           disabled={isLoading}
                        >
                           <OctagonX />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side="right"
                        className="text-inherit rounded"
                     >
                        Cancelar la reserva
                     </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           onClick={() => onConfirmReservation(reservation)}
                           disabled={isLoading}
                        >
                           <CheckCircle />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side="right"
                        className="text-inherit rounded"
                     >
                        Confirmar la reserva
                     </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           onClick={() => onEditReservetion(reservation)}
                           disabled={isLoading}
                        >
                           <Pen />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side="right"
                        className="text-inherit rounded"
                     >
                        Editar
                     </TooltipContent>
                  </Tooltip>
               </>
            );

         case typeStatusTable.CONFIRMED:
            return (
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        onClick={() => onReleasedReservation(reservation)}
                        disabled={isLoading}
                     >
                        <Unlink2 />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent
                     side="right"
                     className="text-inherit rounded"
                  >
                     Completar reserva
                  </TooltipContent>
               </Tooltip>
            );

         default:
            return null;
      }
   };

   return (
      <Card
         className={cn(
            'border-l-4 border-l-primary transition-all duration-200 hover:shadow-md',
            'style-class',
         )}
      >
         <CardContent>
            <div className='flex items-center justify-between gap-1 md:gap-3 flex-wrap'>
               <h3 className='text-sm font-semibold md:text-md'>
                  {reservation.restaurantName}
               </h3>

               <span className='ml-auto text-sm font-mono font-semibold text-nowrap'>
                  {reservation.code}
               </span>

               <Badge
                  className={'text-[9px] md:text-xs ml-auto'}
                  state={reservation.status}
               />

               <Button
                  onClick={toggleExpanded}
                  variant='ghost'
                  size='sm'
                  className='p-2 md:h-8 md:w-8'
               >
                  {isExpanded
                     ? <ChevronUp className='h-4 w-4' />
                     : <ChevronDown className='h-4 w-4' />
                  }
               </Button>
            </div>

            <div
               className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0',
               )}
            >
               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 text-accent-foreground/85'>
                  <div className='flex items-center gap-2 text-sm'>
                     <Calendar className='h-4 w-4 text-primary flex-shrink-0' />
                     <time className='font-medium'>
                        {DateFormat.weekYearMonthDay(reservation.dateStr)}
                     </time>
                  </div>

                  <div className='flex items-center gap-2 text-sm'>
                     <Clock className='h-4 w-4 text-primary flex-shrink-0' />
                     <time className='font-medium'>{reservation.hour}</time>
                  </div>

                  <div className='flex items-center gap-2 text-sm'>
                     <Users className='h-4 w-4 text-primary flex-shrink-0' />
                     <span className='font-medium'>{reservation.diners} personas</span>
                  </div>

                  <div className='space-x-1'>
                     <span className='font-medium'>Mesas:</span>
                     {reservation.tables.map((table, index) => (
                        <span key={table.id}>
                           {table.name}
                           {index < reservation.tables.length - 1 && ', '}
                        </span>
                     ))}
                  </div>
               </div>

               <div className='flex flex-row gap-2 sm:gap-3 pt-2 '>
                  {renderContent()}
               </div>
            </div>
         </CardContent>
      </Card>
   )
}