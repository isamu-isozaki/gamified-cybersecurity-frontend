/*
Author: Isamu Isozaki (isamu.website@gmail.com)
Description: Endpoints for group
Created:  2021-08-28T17:45:21.275Z
Modified: !date!
Modified By: Isamu Isozaki
*/

import api from './index';

export function postCommand({ command } = {}) {
    return api.post('/v1/command', { command });
}