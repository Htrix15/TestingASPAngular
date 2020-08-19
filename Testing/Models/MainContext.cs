﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testing.ServicesModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Testing.Models
{
    public class MainContext : DbContext, IDb
    {
        public DbSet<Model> Models { get; set; }
        public DbSet<User> AdminUsers { get; set; }
        public MainContext(DbContextOptions<MainContext> options) : base(options) { 
        }

        public bool CreateDb()
        {
            try
            {
                Database.EnsureCreated();
                return true;
            }
            catch 
            {
                return false;
            }
        }

        private async Task<IEnumerable<TEntity>> SkipTakeAsync<TEntity>(IQueryable<TEntity> query, int skip = -1, int take = -1)
        {
            if (skip != -1)
            {
                query = query.Skip(skip);
            }
            if (take != -1)
            {
                query = query.Take(take);
            }
            return await query.ToListAsync();
        }

        private async Task<DataShell> DataChangeAsync<TEntity>(TEntity usrData, EntityState entityState = EntityState.Modified) where TEntity : class
        {
            DataShell result = new DataShell();
            try
            {
                Entry<TEntity>(usrData).State = entityState;
               await SaveChangesAsync();
            }
            catch
            {
                result.error = "Fail set data of DB";
            }
            return result;
        }

        public virtual Task<DataShell> UpdateAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Modified);
        }

        public virtual Task<DataShell> DeleteAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Deleted);
        }

        public virtual Task<DataShell> InsertAsync<TEntity>(TEntity data) where TEntity : class
        {
            return DataChangeAsync<TEntity>(data, EntityState.Added);
        }

        public async virtual Task<IEnumerable<TResult>> SelectAsync<TEntity, TResult>(Expression<Func<TEntity, bool>> predicate = null, Expression<Func<TEntity, TResult>> selector = null, int skip = -1, int take = -1)
            where TEntity : class
            where TResult : class
        {
           
           if (selector!=null)
           {
                if (predicate != null)
                {
                    IQueryable<TResult> query = Set<TEntity>().Where(predicate).Select(selector);
                    return await SkipTakeAsync<TResult>(query, skip, take);
                } else
                {
                    IQueryable<TResult> query = Set<TEntity>().Select(selector);
                    return await SkipTakeAsync<TResult>(query, skip, take);
                }
           } else
           {
                if(predicate != null)
                {
                    IQueryable<TEntity> query = Set<TEntity>().Where(predicate);
                    return await SkipTakeAsync<TResult>((IQueryable<TResult>)query, skip, take);
                }
                else
                {
                    IQueryable<TEntity> query = Set<TEntity>();
                    return await SkipTakeAsync<TResult>((IQueryable<TResult>)query, skip, take);
                }
           }
        }

    }

}
