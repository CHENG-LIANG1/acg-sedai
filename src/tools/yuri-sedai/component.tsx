'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';

export function YuriSedai() {
  return (
    <motion.div layoutId="/yuri-sedai" className="flex flex-col gap-4">
      <Card>
        <CardTitle>Yuri Sedai</CardTitle>
      </Card>
    </motion.div>
  );
}
