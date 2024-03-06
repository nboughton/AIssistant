import { ISession } from 'src/components/models';
import { uid } from 'quasar';

export const newSession = (name: string): ISession => ({
  id: uid(),
  name,
  history: [],
  model: 'mistral',
});
