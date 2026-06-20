import { OrigamiPattern } from './types';

export const PATTERNS: OrigamiPattern[] = [
  {
    id: 'paper-crane',
    title: 'Paper Crane',
    category: 'Animals',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 15,
    totalSteps: 10,
    paperSize: '15cm x 15cm',
    paperTypeRecommendation: 'Kami or Washi',
    description: 'The most classic origami figure, symbolizing hope and healing.',
    tags: ['classic', 'bird', 'traditional'],
    imagePlaceholder: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    steps: [
      { stepNumber: 1, title: 'Initial Fold', instruction: 'Start with a square piece of paper, colored side up. Fold in half diagonally to form a triangle.', hint: 'Make sure the edges line up perfectly before pressing the crease down.' },
      { stepNumber: 2, title: 'Second Triangle', instruction: 'Fold the triangle in half again to make a smaller triangle.' },
      { stepNumber: 3, title: 'Squash Fold', instruction: 'Open the top flap, squash folding it down to form a square.' },
      { stepNumber: 4, title: 'Repeat Squash', instruction: 'Turn the paper over and repeat the squash fold on the other side.' },
      { stepNumber: 5, title: 'Kite Base', instruction: 'Fold the top edges into the center line.' },
      { stepNumber: 6, title: 'Petal Fold', instruction: 'Pull the bottom corner up, folding along the creases you just made to form a petal fold.' },
      { stepNumber: 7, title: 'Back Petal Fold', instruction: 'Repeat the petal fold on the back side.' },
      { stepNumber: 8, title: 'Neck and Tail', instruction: 'Fold the two legs up to form the neck and tail. Reverse fold them outwards.' },
      { stepNumber: 9, title: 'Head', instruction: 'Reverse fold the tip of the neck to form the head.' },
      { stepNumber: 10, title: 'Final Adjustments', instruction: 'Gently pull the wings apart and blow into the bottom hole to inflate.' }
    ]
  },
  {
    id: 'jumping-frog',
    title: 'Jumping Frog',
    category: 'Animals',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 10,
    totalSteps: 7,
    paperSize: '15cm x 15cm',
    paperTypeRecommendation: 'Stiff Kami paper or Cardstock',
    description: 'A fun, interactive model that flips when you press its back.',
    tags: ['action', 'fun', 'amphibian'],
    imagePlaceholder: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    steps: [
      { stepNumber: 1, title: 'Center Crease', instruction: 'Start with a square paper. Fold in half top to bottom.' },
      { stepNumber: 2, title: 'X Crease', instruction: 'Fold the top square diagonally both ways to form an X crease.' },
      { stepNumber: 3, title: 'Waterbomb Base', instruction: 'Push the sides in to form a waterbomb base at the top.' },
      { stepNumber: 4, title: 'Body Fold', instruction: 'Fold the bottom rectangular section in half up, then fold its corners into the center.' },
      { stepNumber: 5, title: 'Bottom Point', instruction: 'Fold the bottom point up to meet the center of the model.' },
      { stepNumber: 6, title: 'Front Legs', instruction: 'Fold the sides of the top triangle up to form the front legs.' },
      { stepNumber: 7, title: 'Jumping Spring', instruction: 'Fold the bottom part of the model into a Z-fold to create the jumping spring.' }
    ]
  },
  {
    id: 'lotus-flower',
    title: 'Lotus Flower',
    category: 'Nature',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 20,
    totalSteps: 8,
    paperSize: '20cm x 20cm',
    paperTypeRecommendation: 'Thin but strong paper, like Tant',
    description: 'A beautiful and complex floral design that opens up symmetrically.',
    tags: ['floral', 'decorative', 'complex'],
    imagePlaceholder: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    steps: [
      { stepNumber: 1, title: 'Blintz Base', instruction: 'Fold all four corners into the center of the square.' },
      { stepNumber: 2, title: 'Second Blintz', instruction: 'Fold the new corners into the center again.' },
      { stepNumber: 3, title: 'Third Blintz', instruction: 'Fold the corners into the center for a third time.' },
      { stepNumber: 4, title: 'Flip Over', instruction: 'Turn the paper completely over to the smooth side.' },
      { stepNumber: 5, title: 'Final Corner Fold', instruction: 'Fold the corners into the center one last time.' },
      { stepNumber: 6, title: 'First Petal Pull', instruction: 'Carefully reach behind each corner and pull the flaps forward to form petals.' },
      { stepNumber: 7, title: 'Second Layer Petals', instruction: 'Reach behind again and pull the next layer of flaps forward.' },
      { stepNumber: 8, title: 'Outer Leaves', instruction: 'Pull the final layer of flaps outward to form the outer leaves.' }
    ]
  },
  {
    id: 'paper-boat',
    title: 'Paper Boat',
    category: 'Objects',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 5,
    totalSteps: 8,
    paperSize: 'A4',
    paperTypeRecommendation: 'Standard printer paper',
    description: 'A simple, sturdy paper boat that can actually float.',
    tags: ['classic', 'easy', 'water'],
    imagePlaceholder: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    steps: [
      { stepNumber: 1, title: 'Half Fold', instruction: 'Start with a rectangular piece of paper. Fold it in half top to bottom.' },
      { stepNumber: 2, title: 'Center Crease', instruction: 'Fold in half left to right to create a center crease, then unfold.' },
      { stepNumber: 3, title: 'Top Corners', instruction: 'Fold the top corners down to the center crease.' },
      { stepNumber: 4, title: 'Bottom Flaps', instruction: 'Fold the bottom flaps up tightly against the bottom of the triangle you just formed.' },
      { stepNumber: 5, title: 'First Diamond', instruction: 'Open the bottom and squash flat into a diamond shape.' },
      { stepNumber: 6, title: 'Upward Fold', instruction: 'Fold the bottom points of the diamond up to the top point on both sides, creating a smaller triangle.' },
      { stepNumber: 7, title: 'Second Diamond', instruction: 'Open the bottom again and squash flat into a new diamond.' },
      { stepNumber: 8, title: 'Reveal Boat', instruction: 'Gently pull the top flaps apart to reveal the boat. Crease the bottom edges to help it stand.' }
    ]
  },
  {
    id: 'butterfly',
    title: 'Butterfly',
    category: 'Nature',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 8,
    totalSteps: 6,
    paperSize: '15cm x 15cm',
    paperTypeRecommendation: 'Double-sided patterned paper',
    description: 'A delicate and elegant origami butterfly perfect for decoration.',
    tags: ['insect', 'delicate', 'decoration'],
    imagePlaceholder: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    steps: [
      { stepNumber: 1, title: 'Waterbomb Base', instruction: 'Create a waterbomb base from a square piece of paper.' },
      { stepNumber: 2, title: 'Top Points', instruction: 'Fold the top two points of the triangle down to meet the bottom center edge.' },
      { stepNumber: 3, title: 'Flip Over', instruction: 'Turn the model over so the smooth side is facing up.' },
      { stepNumber: 4, title: 'Bottom Point Up', instruction: 'Fold the bottom point up so it extends slightly past the top edge of the model.' },
      { stepNumber: 5, title: 'Locking Fold', instruction: 'Fold the small overlapping tip over the top edge to lock the layers together.' },
      { stepNumber: 6, title: 'Wing Shape', instruction: 'Fold the model in half vertically and pitch the center gently to shape the wings.' }
    ]
  },
  {
    id: 'lucky-star',
    title: 'Lucky Star',
    category: 'Objects',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 3,
    totalSteps: 5,
    paperSize: '1cm x 25cm',
    paperTypeRecommendation: 'Star paper strips',
    description: 'Tiny, puffy stars folded from long strips. Often made in jars for good luck.',
    tags: ['tiny', 'gift', 'strip'],
    imagePlaceholder: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    steps: [
      { stepNumber: 1, title: 'Make a Knot', instruction: 'Take a paper strip and tie a simple overhand knot near one end.' },
      { stepNumber: 2, title: 'Flatten Pentagon', instruction: 'Gently pull the knot tight and flatten it into a neat pentagon shape.' },
      { stepNumber: 3, title: 'Tuck Short End', instruction: 'Tuck the short tail end of the strip into the knot to hide it.' },
      { stepNumber: 4, title: 'Wrap Strip', instruction: 'Wrap the long end of the strip around the pentagon, following its natural edges.' },
      { stepNumber: 5, title: 'Puff it Up', instruction: 'Tuck the remaining tail inside, then use your fingernails to indent the center of each edge, puffing the star up.' }
    ]
  },
  {
    id: 'fox-face',
    title: 'Fox Face',
    category: 'Animals',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 5,
    totalSteps: 5,
    paperSize: '15cm x 15cm',
    paperTypeRecommendation: 'Orange Kami paper',
    description: 'A very simple face model that is easy to teach to children.',
    tags: ['easy', 'animal', 'cute'],
    imagePlaceholder: 'linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)',
    steps: [
      { stepNumber: 1, title: 'Diagonal Fold', instruction: 'Fold your square paper in half diagonally to make a triangle.' },
      { stepNumber: 2, title: 'Side Points', instruction: 'Fold both side points up to meet the top point, forming a smaller square.' },
      { stepNumber: 3, title: 'Ears Outward', instruction: 'Fold the top two flaps outward at an angle to create the fox ears.' },
      { stepNumber: 4, title: 'Snout Fold', instruction: 'Turn the model over and fold the top layer of the bottom point up slightly to form the snout.' },
      { stepNumber: 5, title: 'Nose Detail', instruction: 'Fold the very tip of the snout down slightly to create a flat nose.' }
    ]
  },
  {
    id: 'modular-cube',
    title: 'Modular Cube',
    category: 'Modular',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 30,
    totalSteps: 6,
    paperSize: '10cm x 10cm',
    paperTypeRecommendation: 'Stiff paper',
    description: 'A geometric cube constructed from six identical Sonobe units.',
    tags: ['geometric', 'unit', '3D'],
    imagePlaceholder: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    steps: [
      { stepNumber: 1, title: 'Center Crease', instruction: 'Take one square. Fold it in half to make a vertical center crease.' },
      { stepNumber: 2, title: 'Cupboard Fold', instruction: 'Fold the left and right edges into the center crease.' },
      { stepNumber: 3, title: 'Opposite Corners', instruction: 'Fold the top right corner down to the left edge, and the bottom left corner up to the right edge.' },
      { stepNumber: 4, title: 'Tuck Corners', instruction: 'Tuck these triangular flaps under the rectangular layers to lock the unit. Make 5 more identical units.' },
      { stepNumber: 5, title: 'Assembly Start', instruction: 'Insert the triangular tab of one unit into the center pocket of a second unit.' },
      { stepNumber: 6, title: 'Locking Cube', instruction: 'Continue connecting tabs to pockets at 90-degree angles until all 6 units form a closed cube.' }
    ]
  }
];
