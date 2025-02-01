import { FindManyOptions, SelectQueryBuilder, FindOptionsOrder } from 'typeorm';

export function applySorting<T>(
  qb: SelectQueryBuilder<T>,
  sort: string | undefined,
  sortOrder: string | undefined,
  defaultSortField: string = 'id',
  defaultSortOrder: 'ASC' | 'DESC' = 'DESC',
): SelectQueryBuilder<T> {
  const order = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const sortField = sort ? sort : defaultSortField;

  qb.orderBy(`${qb.alias}.${sortField}`, order || defaultSortOrder);
  return qb;
}

export function applySortingToFindOptions<T>(
  options: FindManyOptions<T>,
  sort: string | undefined,
  sortBy: string | undefined,
  defaultSortBy: string = 'id',
  defaultSort: 'ASC' | 'DESC' = 'DESC',
): FindManyOptions<T> {
  const order = sort ? sort : defaultSort;
  const sortField = sortBy ? sortBy : defaultSortBy;

  options.order = {
    [sortField]: order || defaultSort,
  } as FindOptionsOrder<T>;

  return options;
}
