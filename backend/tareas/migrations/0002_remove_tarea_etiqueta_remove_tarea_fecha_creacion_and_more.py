# Generated by Django 5.1.1 on 2024-10-09 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tareas', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tarea',
            name='etiqueta',
        ),
        migrations.RemoveField(
            model_name='tarea',
            name='fecha_creacion',
        ),
        migrations.AddField(
            model_name='tarea',
            name='etiquetas',
            field=models.ManyToManyField(blank=True, related_name='tareas', to='tareas.etiqueta'),
        ),
    ]
