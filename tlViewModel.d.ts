declare module Triarc.Vm {
    /**
     *
     */
    class ViewModel<TCm extends IClientModel<any>, TKey> implements IViewModel<TCm, TKey> {
        private vmImpl;
        /**
         *
         */
        protected $cm: TCm;
        /**
         *
         */
        private lazyMap;
        constructor(vmImpl: (vm: IViewModel<TCm, TKey>) => IViewModelImpl<TCm, TKey>, cm: TCm);
        /**
         *
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
     * An enum that represents the current state of the ViewModelPromise
     */
    enum EPromiseState {
        NotResolved = 0,
        Resolving = 1,
        Resolved = 2,
        Failed = 3,
    }
    /**
     *
     */
    class ViewModelPromise<TResult> {
        private resolveFn;
        /**
         * The result(s) of the fetched promise value
         */
        value: TResult;
        /**
         * The promise used to asynchronously fetch the results
         */
        protected $promise: angular.IPromise<TResult>;
        /**
         * The current state of the promise
         */
        private $state;
        constructor(resolveFn: () => angular.IPromise<TResult>);
        /**
         * Returns the current state of the ViewModelPromise
         * @returns {}
         */
        state: EPromiseState;
        /**
         * The promise fetching the results
         * @returns {}
         */
        /**
         * Sets the promise for the asynchronous fetch and will controll all appropriate states of the ViewModelPromise
         * @param val
         * @returns {}
         */
        promise: angular.IPromise<TResult>;
        /**
         * Clears down the ViewModel promise to its default values
         * @returns {}
         */
        clear(): void;
        resolveManually($q: angular.IQService, result: TResult): void;
        /**
         * Performs the fetch for the results using the function (returning a promise) and then sets the values
         * @param resolve
         * @returns {}
         */
        resolve(): ViewModelPromise<TResult>;
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
        updateCm(cm: TCm): any;
    }
}
declare module Triarc.Vm {
    interface IGetOptions {
        forceReload?: boolean;
        additionalRequestArgs?: any;
        preventDebounce?: boolean;
    }
    interface IEntityStoreAdapter<TCm, TVm, TKey> {
        has(id: TKey): boolean;
        get(id: TKey): TVm;
        attachMultipleAndGet(entities: TCm[]): TVm[];
    }
    class ViewModelLoadRegistry<TCm extends Vm.IClientModel<TKey>, TVm extends Vm.IViewModel<TCm, TKey>, TKey> {
        private $q;
        private loadCallback;
        private entityStoreAdapter;
        private debounceIntervall;
        constructor($q: angular.IQService, loadCallback: (keys: TKey[], args?: any) => angular.IPromise<TCm[]>, entityStoreAdapter: IEntityStoreAdapter<TCm, TVm, TKey>, debounceIntervall?: number);
        private $promises;
        get(ids: TKey[], options?: IGetOptions): angular.IPromise<TVm[]>;
        private timeoutRunning;
        private debounceDefer;
        private debouncedIds;
        private startLoadingIds(ids, options);
        private debounceLoading(ids, options);
        private resetDebounce();
        private loadIds(ids, options);
    }
}
declare module Triarc.Vm {
    /**
     *
     */
    class ViewModelRefStore<TCm extends IClientModel<any>, TVm extends IViewModel<any, any>, TKey> {
        private defaultFactoryFn;
        protected referenceMap: Map<TKey, TVm>;
        constructor(defaultFactoryFn: (cm: TCm) => TVm);
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
        protected updateViewModel(entityCm: TCm, viewModel: TVm, createVmCallback?: (cm: TCm) => TVm): void;
        /**
         *
         * @param entities
         * @param createVmCallback
         * @param isChanged
         * @returns {}
         */
        attachMultipleAndGet(entities: TCm[], createVmCallback?: (cm: TCm) => TVm, isChanged?: {
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
        attachAndGet(entityCm: TCm, createVmCallback?: (cm: TCm) => TVm, isChanged?: {
            isChanged?: boolean;
        }, updateOnSameTimestamp?: boolean): TVm;
        /**
         *
         * @param changeSet
         * @param createVmCallback
         * @param filterUnchaged
         * @returns {}
         */
        attachChangeSet(changeSet: IChangeSet<TCm, TKey>, createVmCallback?: (cm: TCm) => TVm, filterUnchaged?: boolean): IChangeSet<TVm, TKey>;
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
