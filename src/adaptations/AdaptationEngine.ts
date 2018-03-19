import * as kevoree from 'kevoree-library';

export interface AdaptationEngine<T> {

    /**
     * Creates or removes the appropriate view-model instances according to the kevoree event
     * @param event kevoree model event
     */
    adapt(event: kevoree.ModelEvent): void;

    /**
     * Creates the appropriate view-model instances by reading the current state
     * of the given kevoree element
     * @param elem 
     */
    createInstances(elem: T): void;
}