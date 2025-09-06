import { Sequelize } from '@sequelize/core';
import fs from 'node:fs/promises';
import YAML from 'yaml';


Sequelize.prototype.defineFromYaml = async function (file_name) {
    const str = await fs.readFile(file_name, { encoding: 'utf-8' });
    const { model_name, attributes, options } = YAML.parse(str);
    return this.define(model_name, attributes, options);
};

Sequelize.prototype.defineModelsFromYaml = async function (models_dir) {
    if (await fs.exists(models_dir) === false) return;
    const files = (await fs.readdir(models_dir)).filter((file) => file.endsWith('.yml'));
    for (const file_name of files) this.defineFromYaml(`${models_dir}/${file_name}`);
};


export default class extends Sequelize {

    constructor(...args) {
        super(...args);
    }

    async defineFromYaml(file_name) {
        const str = await fs.readFile(file_name, { encoding: 'utf-8' });
        const { model_name, attributes, options } = YAML.parse(str);
        return this.define(model_name, attributes, options);
    }

    async defineModelsFromYaml(models_dir) {
        if (await fs.exists(models_dir) === false) return;
        const files = (await fs.readdir(models_dir)).filter((file) => file.endsWith('.yml'));
        for (const file_name of files) {
            await this.defineFromYaml(`${models_dir}/${file_name}`);
        }
    }
}
