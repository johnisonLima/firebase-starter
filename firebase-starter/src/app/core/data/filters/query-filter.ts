// Aqui vai a interface para o filtro de consulta, que será usado para filtrar os dados retornados pelo repositório

export interface QueryFilter {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
    value: unknown;
}