export interface TaksType {
    _id: string;
    titulo: string;
    descripcion: string;
    completada: boolean;
}

// utili types
// export interface TaksTypeFiltrado extends Omit<TaksType, 'id' | 'completada' | 'borrada'>{
//     titulo: string;
//     descripcion: string;
// }
