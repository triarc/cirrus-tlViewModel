var Triarc;
(function (Triarc) {
    var Vm;
    (function (Vm) {
        /**
         *
         */
        var ViewModel = (function () {
            function ViewModel(vmImpl, cm) {
                this.vmImpl = vmImpl;
                /**
                 *
                 */
                this.lazyMap = new Map();
                this.$cm = cm;
            }
            Object.defineProperty(ViewModel.prototype, "id", {
                /**
                 *
                 * @returns {}
                 */
                get: function () {
                    return this.$cm.id;
                },
                enumerable: true,
                configurable: true
            });
            /**
             *
             * @param cm
             * @returns {}
             */
            ViewModel.prototype.update = function (cm) {
                this.vmImpl(this).updateCm(cm);
            };
            Object.defineProperty(ViewModel.prototype, "timestamp", {
                /**
                 *
                 * @returns {}
                 */
                get: function () {
                    return this.$cm.timestamp;
                },
                enumerable: true,
                configurable: true
            });
            /**
             *
             * @returns {}
             */
            ViewModel.prototype.resetLazies = function () {
                this.lazyMap.clear();
            };
            /**
             *
             * @param key
             * @param resolve
             * @param emptyDefault
             * @returns {}
             */
            ViewModel.prototype.lazyLoad = function (key, resolve, emptyDefault) {
                var result = this.lazyMap.get(key);
                if (angular.isUndefined(result)) {
                    result = resolve();
                    if (angular.isDefined(result) && result !== null) {
                        this.lazyMap.set(key, result);
                    }
                    else {
                        result = emptyDefault || null;
                    }
                }
                return result;
            };
            return ViewModel;
        })();
        Vm.ViewModel = ViewModel;
    })(Vm = Triarc.Vm || (Triarc.Vm = {}));
})(Triarc || (Triarc = {}));
var Triarc;
(function (Triarc) {
    var Vm;
    (function (Vm) {
        /**
         *
         * An enum that represents the current state of the ViewModelPromise
         */
        (function (EPromiseState) {
            EPromiseState[EPromiseState["NotResolved"] = 0] = "NotResolved";
            EPromiseState[EPromiseState["Resolving"] = 1] = "Resolving";
            EPromiseState[EPromiseState["Resolved"] = 2] = "Resolved";
            EPromiseState[EPromiseState["Failed"] = 3] = "Failed";
        })(Vm.EPromiseState || (Vm.EPromiseState = {}));
        var EPromiseState = Vm.EPromiseState;
        /**
         *
         */
        var ViewModelPromise = (function () {
            function ViewModelPromise(resolveFn) {
                this.resolveFn = resolveFn;
                /**
                 * The result(s) of the fetched promise value
                 */
                this.value = null;
                this.clear();
            }
            Object.defineProperty(ViewModelPromise.prototype, "state", {
                /**
                 * Returns the current state of the ViewModelPromise
                 * @returns {}
                 */
                get: function () {
                    return this.$state;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModelPromise.prototype, "promise", {
                /**
                 * The promise fetching the results
                 * @returns {}
                 */
                get: function () {
                    return this.$promise;
                },
                /**
                 * Sets the promise for the asynchronous fetch and will controll all appropriate states of the ViewModelPromise
                 * @param val
                 * @returns {}
                 */
                set: function (val) {
                    var _this = this;
                    this.$state = EPromiseState.Resolving;
                    this.value = null;
                    this.$promise = val;
                    this.$promise.then(function () { return _this.$state = EPromiseState.Resolved; }, function () { return _this.$state = EPromiseState.Failed; });
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Clears down the ViewModel promise to its default values
             * @returns {}
             */
            ViewModelPromise.prototype.clear = function () {
                this.$state = EPromiseState.NotResolved;
                this.$promise = null;
            };
            /**
             * Performs the fetch for the results using the function (returning a promise) and then sets the values
             * @param resolve
             * @returns {}
             */
            ViewModelPromise.prototype.resolve = function () {
                var _this = this;
                if ((this.$state !== EPromiseState.Resolving || this.$state !== EPromiseState.Resolved || this.$state !== EPromiseState.Failed) && Triarc.hasNoValue(this.$promise)) {
                    this.promise = this.resolveFn().then(function (result) { return _this.value = result; });
                }
                return this;
            };
            return ViewModelPromise;
        })();
        Vm.ViewModelPromise = ViewModelPromise;
    })(Vm = Triarc.Vm || (Triarc.Vm = {}));
})(Triarc || (Triarc = {}));
var Triarc;
(function (Triarc) {
    var Vm;
    (function (Vm) {
        /**
         *
         */
        var ViewModelRefStore = (function () {
            function ViewModelRefStore(defaultFactoryFn) {
                this.defaultFactoryFn = defaultFactoryFn;
                this.referenceMap = new Map();
            }
            ViewModelRefStore.prototype.getTimestampFromVm = function (entity) {
                return entity.timestamp;
            };
            /**
             *
             * @param entity
             * @returns {}
             */
            ViewModelRefStore.prototype.getTimestampFromCm = function (entity) {
                return entity.timestamp;
            };
            /**
             *
             * @param entityCm
             * @param viewModel
             * @param createVmCallback
             * @returns {}
             */
            ViewModelRefStore.prototype.updateViewModel = function (entityCm, viewModel, createVmCallback) {
                viewModel.update(entityCm);
                //angular.extend(viewModel, createVmCallback(entityCm));
            };
            /**
             *
             * @param entities
             * @param createVmCallback
             * @param isChanged
             * @returns {}
             */
            ViewModelRefStore.prototype.attachMultipleAndGet = function (entities, createVmCallback, isChanged) {
                var _this = this;
                var result = [];
                var createVmFn = angular.isFunction(createVmCallback) ? createVmCallback : this.defaultFactoryFn;
                if (angular.isArray(entities)) {
                    entities.forEach(function (e) { return result.push(_this.attachAndGet(e, createVmFn, isChanged)); });
                }
                return result;
            };
            /**
             *
             * @param entityCm
             * @param createVmCallback
             * @param isChanged
             * @param updateOnSameTimestamp
             * @returns {}
             */
            ViewModelRefStore.prototype.attachAndGet = function (entityCm, createVmCallback, isChanged, updateOnSameTimestamp) {
                if (updateOnSameTimestamp === void 0) { updateOnSameTimestamp = false; }
                var createVmFn = angular.isFunction(createVmCallback) ? createVmCallback : this.defaultFactoryFn;
                var entityId = entityCm.id;
                if (angular.isObject(isChanged)) {
                    isChanged.isChanged = true;
                }
                else {
                    isChanged = {
                        isChanged: true
                    };
                }
                var existingVm = this.referenceMap.get(entityId);
                if (angular.isObject(existingVm)) {
                    var existingTimestamp = this.getTimestampFromVm(existingVm);
                    var newTimestamp = this.getTimestampFromCm(entityCm);
                    if (existingTimestamp == null || existingTimestamp < newTimestamp) {
                        console.log('override loaded entity:' + entityId + "   old:" + existingTimestamp + "   new:" + newTimestamp);
                        this.updateViewModel(entityCm, existingVm, createVmFn);
                    }
                    else if (existingTimestamp === newTimestamp) {
                        if (updateOnSameTimestamp) {
                            this.updateViewModel(entityCm, existingVm, createVmFn);
                        }
                        else {
                            isChanged.isChanged = false;
                        }
                    }
                    else {
                        console.warn("existing entity " + entityId + " is newer than new one, reject");
                        isChanged.isChanged = false;
                    }
                    return existingVm;
                }
                var newVm = createVmFn(entityCm);
                this.referenceMap.set(entityId, newVm);
                return newVm;
            };
            /**
             *
             * @param changeSet
             * @param createVmCallback
             * @param filterUnchaged
             * @returns {}
             */
            ViewModelRefStore.prototype.attachChangeSet = function (changeSet, createVmCallback, filterUnchaged) {
                var _this = this;
                if (filterUnchaged === void 0) { filterUnchaged = true; }
                var createVmFn = angular.isFunction(createVmCallback) ? createVmCallback : this.defaultFactoryFn;
                var added = [];
                if (angular.isArray(changeSet.added)) {
                    changeSet.added.forEach(function (t) {
                        var isChanged = {
                            isChanged: false
                        };
                        var attachClientModel = _this.attachAndGet(t, createVmFn, isChanged);
                        if (isChanged.isChanged || !filterUnchaged)
                            added.push(attachClientModel);
                    });
                }
                var updated = [];
                if (angular.isArray(changeSet.updated)) {
                    changeSet.updated.forEach(function (t) {
                        var isChanged = {
                            isChanged: false
                        };
                        var attachClientModel = _this.attachAndGet(t, createVmFn, isChanged);
                        if (isChanged.isChanged || !filterUnchaged)
                            updated.push(attachClientModel);
                    });
                }
                changeSet.deleted.forEach(function (id) {
                    _this.referenceMap.delete(id);
                });
                return {
                    deleted: changeSet.deleted,
                    added: added,
                    updated: updated
                };
            };
            /**
             *
             * @param id
             * @returns {}
             */
            ViewModelRefStore.prototype.get = function (id) {
                var vm = this.referenceMap.get(id);
                if (angular.isObject(vm))
                    return vm;
                return null;
            };
            /**
             *
             * @param id
             * @returns {}
             */
            ViewModelRefStore.prototype.has = function (id) {
                return this.referenceMap.has(id);
            };
            /**
             * Returns all entities. Remember, that "With great power comes great responsibility"
             * @returns {}
             */
            ViewModelRefStore.prototype.getAll = function () {
                return this.referenceMap.getValues();
            };
            /**
             * Allows the full injection. TODO remove if replaced in wettstein
             * @param changeSet
             * @param dataControllerId
             * @returns {}
             */
            ViewModelRefStore.inject = function (changeSet, dataControllerId) {
                Triarc.Data.convertDateStringsToDates(changeSet);
                var injector = $("#app").injector();
                if (!angular.isObject(injector))
                    return;
                injector.invoke([
                    dataControllerId, function (datadataController) {
                        datadataController.applyChangeSet(changeSet);
                    }
                ]);
            };
            return ViewModelRefStore;
        })();
        Vm.ViewModelRefStore = ViewModelRefStore;
    })(Vm = Triarc.Vm || (Triarc.Vm = {}));
})(Triarc || (Triarc = {}));

