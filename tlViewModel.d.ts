declare module Triarc.Vm {
    /**
     *
     */
    class ViewModel<TCm extends IClientModel<any>, TKey> implements IViewModel<TCm, TKey> {
        /**
         *
         */
        protected $cm: TCm;
        /**
         *
         */
        private lazyMap;
        constructor(vmImpl: IViewModelImpl<TCm, TKey>, cm: TCm);
        /**
         *
         * @returns {}
         */
        /**
         *
         * @param value
         * @returns {}
         */
        id: TKey;
        /**
         *
         * @param cm
         * @returns {}
         */
        update(cm: TCm): void;
        /**
         *
         * @returns {}
         */
        timestamp: number;
        /**
         *
         * @returns {}
         */
        resetLazies(): void;
        /**
         *
         * @param key
         * @param resolve
         * @param emptyDefault
         * @returns {}
         */
        protected lazyLoad<TResult>(key: string, resolve: () => TResult, emptyDefault?: TResult): TResult;
    }
}
declare module Triarc.Vm {
    /**
     *
     */
    class ViewModelPromise<TResult> {
        /**
         * The result(s) of the fetched promise value
         */
        value: TResult;
        /**
         * The promise used to asynchronously fetch the results
         */
        protected $promise: angular.IPromise<TResult>;
        /**
         * Used to determin if the fetched results was successful or not
         */
        succeeded: boolean;
        /**
         * Used to determin if the fetched results was not successful
         */
        failed: boolean;
        /**
         * The promise fetching the results
         * @returns {}
         */
        /**
         * Sets the promise for the asynchronous fetch and will controll all appropriate states of the ViewModelPromise
         * @param val
         * @returns {}
         */
        promise: ng.IPromise<TResult>;
        /**
         * Performs the fetch for the results using the function (returning a promise) and then sets the values
         * @param resolve
         * @returns {}
         */
        resolve(resolve: () => angular.IPromise<TResult>): ViewModelPromise<TResult>;
    }
}
declare module Triarc.Vm {
    /**
    * Interface that will be forced on all ClientModel (i.e. cm) where the properties are used in the reference store
    */
    interface IClientModel<TKey> {
        timestamp: number;
        id: TKey;
    }
    /**
     * Interface that will be foreced on all ViewModels where the properties are used in the reference store
     */
    interface IViewModel<TCm, TKey> {
        id: TKey;
        update(cm: TCm): void;
        timestamp: number;
    }
    /**
     * Interface that will be foreced on all ViewModels that extend a ViewModel.ts
     */
    interface IViewModelImpl<TCm, TKey> {
        toCm(): TCm;
        reset(): void;
        clone(): IViewModelImpl<TCm, TKey>;
        update(cm: TCm): any;
    }
}
declare module Triarc.Vm {
    /**
     *
     */
    class ViewModelRefStore<TCm extends IClientModel<any>, TVm extends IViewModel<any, any>, TKey> {
        protected referenceMap: Map<TKey, TVm>;
        protected getTimestampFromVm(entity: TVm): number;
        /**
         *
         * @param entity
         * @returns {}
         */
        protected getTimestampFromCm(entity: TCm): number;
        /**
         *
         * @param entityCm
         * @param viewModel
         * @param createVmCallback
         * @returns {}
         */
        protected updateViewModel(entityCm: TCm, viewModel: TVm, createVmCallback: (cm: TCm) => TVm): void;
        /**
         *
         * @param entities
         * @param createVmCallback
         * @param isChanged
         * @returns {}
         */
        attachMultipleAndGet(entities: TCm[], createVmCallback: (cm: TCm) => TVm, isChanged?: {
            isChanged?: boolean;
        }): TVm[];
        /**
         *
         * @param entityCm
         * @param createVmCallback
         * @param isChanged
         * @param updateOnSameTimestamp
         * @returns {}
         */
        attachAndGet(entityCm: TCm, createVmCallback: (cm: TCm) => TVm, isChanged?: {
            isChanged?: boolean;
        }, updateOnSameTimestamp?: boolean): TVm;
        /**
         *
         * @param changeSet
         * @param createVmCallback
         * @param filterUnchaged
         * @returns {}
         */
        attachChangeSet(changeSet: IChangeSet<TCm, TKey>, createVmCallback: (cm: TCm) => TVm, filterUnchaged?: boolean): IChangeSet<TVm, TKey>;
        /**
         *
         * @param id
         * @returns {}
         */
        get(id: TKey): TVm;
        /**
         *
         * @param id
         * @returns {}
         */
        has(id: TKey): boolean;
        /**
         * Returns all entities. Remember, that "With great power comes great responsibility"
         * @returns {}
         */
        getAll(): TVm[];
        /**
         * Allows the full injection. TODO remove if replaced in wettstein
         * @param changeSet
         * @param dataControllerId
         * @returns {}
         */
        static inject(changeSet: IChangeSet<any, any>, dataControllerId: string): void;
    }
    /**
     *
     */
    interface IChangeSet<T, TKey> {
        added: T[];
        updated: T[];
        deleted: TKey[];
    }
}
