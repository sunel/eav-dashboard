
class Deserialise {

    included = {};
    types = {};
    data;

    constructor(json) {
        let { data, included } = json;

        this.included = this.indexInclude(included);
        this.data = data;
    }

    run() {
        return this.build(this.data);
    }

    build(data) {

        let body = null;

        if(Array.isArray(data)) {
            // Collection
            body = [];

            data.forEach((item) => {                       
                body.push(Object.assign(this.normalize(item), this.normalizeRelation(item)));
            });
        } else { 
            // Item          
            body = Object.assign(this.normalize(data), this.normalizeRelation(data));
        }

        return body;
    }

    normalize(data) {

        let attributes = data.attributes;
        if(!attributes) {
            attributes = this.included[`${data.type}-${data.id}`];
        }

        const normalized = Object.assign({ type: data.type, id: data.id }, attributes);

        this.types[data.type] = Object.assign({}, this.types[data.type], { [data.id] : normalized})

        return normalized;
    }

    normalizeRelation(data) {
        if(!data.relationships) {
            return null;
        }

        let relationships = data.relationships;
        let body = {
            relationshipNames: []
        };

        Object.keys(relationships).forEach((realtion) => {
            body[realtion] = this.build(relationships[realtion].data);
            body['relationshipNames'].push(realtion);
        })

        return body;        
    }

    indexInclude(data) {
        if(!data) {
            return {};
        }

        let collection = {};

        data.forEach((item) => {
            collection[`${item.type}-${item.id}`] = this.normalize(item);
        });

        return collection;
    }
}


class Serialise {
    
    relationshipNames;

    constructor(relationshipNames) {
        this.relationshipNames = relationshipNames;
    }

    run(data) {
        return this.build(data);
    }

    build(data) {
        let body = null;

        if(Array.isArray(data)) {
            // Collection
            body = [];

            data.forEach((item) => {                       
                body.push(Object.assign(this.normalize(item), this.normalizeRelation(item)));
            });
        } else { 
            // Item          
            body = Object.assign(this.normalize(data), this.normalizeRelation(data));
        }

        return body;
    }

    normalize(data) {

        let exceptProps = ['id', 'type', 'relationshipNames', ...this.relationshipNames];

        let attributes = {};
        Object.keys(data).forEach((attrName) => {
            if (exceptProps.indexOf(attrName) === -1) {
                attributes[attrName] = data[attrName];
            }
        });

        if(Object.keys(attributes).length) {
            return { type: data.type, id: data.id , attributes };
        }

        return { type: data.type, id: data.id };
    }

    normalizeRelation(data) {

        const relationships = {};
        this.relationshipNames.forEach((relationName) => {
            if (data[relationName] !== undefined) {
                relationships[relationName] = { data: this.build(data[relationName]) };
            }
        });

        if(Object.keys(relationships).length) {
            return { relationships };
        }

        return null;
    }
}

export default class JsonApi {

    deserialize(json) {
        const deserialiser = new Deserialise(json);
        return deserialiser.run();
    }

    serialize(data, relationshipNames) {
        const serialiser = new Serialise(relationshipNames);
        return serialiser.run(data);
    }
    
}
