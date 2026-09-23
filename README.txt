GLB DROP-IN
===========
The uploaded attachment in this task was an MP4, not a GLB, so no model bytes were available to optimize.

To enable the full React Three Fiber experience:
1. Put your untouched original model here as:
   public/model/sneaker-source.glb
2. Run:
   npm run optimize:model
3. This creates a separate optimized copy:
   public/model/sneaker-optimized.glb

The original sneaker-source.glb is never modified.
The app automatically detects sneaker-optimized.glb and switches from the scroll-scrub MP4 fallback to the live 3D scene.
