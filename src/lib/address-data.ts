import locations from '../../location.json';

// The form is structured to have a top-level country key.
// The location.json file contains only Rwandan addresses, so we wrap it.
export const addressData: Record<string, any> = {
  Rwanda: locations,
  // You can add other countries here if needed, following the same structure.
  Kenya: {
    'Nairobi': {
        'Dagoretti': {
            'North': {
                'Kilimani': ['Kilimani', 'Hurlingham'],
                'Kawangware': ['Kawangware', 'Gatina']
            },
            'South': {
                'Riruta': ['Riruta', 'Satellite'],
                'Waithaka': ['Waithaka', 'Kabiria']
            }
        }
    }
  }
};
