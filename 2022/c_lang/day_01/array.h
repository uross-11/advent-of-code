// guards
#ifndef ARRAY_H
#define ARRAY_H

#include <stddef.h>

typedef struct {
  int *array; // points to the first item
  size_t used;
  size_t size;
} Array;

int compare(const void *a, const void *b);

void init_array(Array *a, size_t initialSize);

void insert_array(Array *a, int element);

void sort_array(Array *a);

void free_array(Array *a);

#endif
