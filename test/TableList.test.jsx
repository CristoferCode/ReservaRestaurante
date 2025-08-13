// import { render, screen, fireEvent } from '@testing-library/react'
// import { describe, expect, it, vi } from 'vitest'
// import { typeResource } from '@/ultils'
// import { TableList } from '../src/components/UI/table'

// // Mock del hook para controlar el renderizado
// vi.mock('@/hook/common', () => ({
//    usePaintedGrid: vi.fn(({ renderResource }) => {
//       const fakeTable = renderResource(
//          { id: '1', type: typeResource.TABLE, status: 'available', name: 'Mesa 1' },
//          {}
//       )
//       const fakeObject = renderResource(
//          { id: '2', type: typeResource.OBJECT, image: 'fake.jpg' },
//          {}
//       )
//       return [fakeTable, fakeObject]
//    }),
// }))

// // Mock de componentes hijos para simplificar
// vi.mock('@/components', () => ({
//    CardTable: ({ children }) => <div data-testid="card-table">{children}</div>,
//    Table: ({ name, onClick, onPreview }) => (
//       <div>
//          <button onClick={onClick}>{name}</button>
//          <button onClick={onPreview}>Preview</button>
//       </div>
//    ),
// }))

// vi.mock('../resource', () => ({
//    Object: ({ object }) => <div>Object-{object.id}</div>,
// }))

// describe('TableList', () => {
//    it('renderiza los recursos y dispara eventos', () => {
//       const onSelectTables = vi.fn()
//       const onCurrentTable = vi.fn()

//       render(
//          <TableList
//             rows={5}
//             columns={5}
//             onSelectTables={onSelectTables}
//             onCurrentTable={onCurrentTable}
//             resources={[
//                { id: '1', type: typeResource.TABLE },
//                { id: '2', type: typeResource.OBJECT },
//             ]}
//          />
//       )

//       // Verifica que se renderizó la mesa y el objeto
//       expect(screen.getByText('Mesa 1')).toBeInTheDocument()
//       // expect(screen.getByText('Object-2')).toBeInTheDocument()

//       // Click en la mesa
//       fireEvent.click(screen.getByText('Mesa 1'))
//       expect(onSelectTables).toHaveBeenCalledTimes(1)

//       // Click en preview
//       // fireEvent.click(screen.getByText('Preview'))
//       expect(onCurrentTable).toHaveBeenCalledTimes(1)
//    })
// })
