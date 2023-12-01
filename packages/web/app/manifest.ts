import { MetadataRoute } from 'next';

import publicManifest from '../public/manifest.json';

export default function manifest(): MetadataRoute.Manifest {
  return { ...publicManifest } as MetadataRoute.Manifest;
}
