<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TarefaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => 'nullable|integer|min:1|max:5',
            'due_date' => 'nullable|date|after:now'
        ];

        // Para atualização, alguns campos são opcionais
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = 'sometimes|required|string|max:255';
            $rules['completed'] = 'sometimes|boolean';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título da tarefa é obrigatório',
            'title.max' => 'O título não pode ter mais de 255 caracteres',
            'description.max' => 'A descrição não pode ter mais de 1000 caracteres',
            'priority.min' => 'A prioridade deve ser no mínimo 1',
            'priority.max' => 'A prioridade deve ser no máximo 5',
            'due_date.after' => 'A data de vencimento deve ser futura',
            'due_date.date' => 'A data de vencimento deve ser uma data válida'
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'título',
            'description' => 'descrição',
            'priority' => 'prioridade',
            'due_date' => 'data de vencimento',
            'completed' => 'concluída'
        ];
    }
}
