<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarefa extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'completed',
        'description',
        'priority',
        'due_date'
    ];

    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'datetime',
        'priority' => 'integer'
    ];

    protected $attributes = [
        'completed' => false,
        'priority' => 1
    ];

    public function scopeActive($query)
    {
        return $query->where('completed', false);
    }

    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }
}
