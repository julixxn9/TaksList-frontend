export interface TaksType {
    id: number;
    titulo: string;
    descripcion: string;
    completada: boolean;
    borrada: boolean;
}

// utili types
// export interface TaksTypeFiltrado extends Omit<TaksType, 'id' | 'completada' | 'borrada'>{
//     titulo: string;
//     descripcion: string;
// }
