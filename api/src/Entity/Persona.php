<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @see http://schema.org/Person Documentation on Schema.org
 *
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\PersonaRepository")
 * @ApiFilter(PropertyFilter::class)
 * @ApiFilter(OrderFilter::class, properties={"id", "nombres", "apellidos"})
 */
class Persona
{
    /**
     * @var Id person
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string The name of the item
     *
     * @ApiFilter(SearchFilter::class, strategy="ipartial")
     * @ORM\Column(type="string")
     */
    private $nombres;

    /**
     * @var string Family name. In the U.S., the last name of an Person. This can be usedalong with givenName instead of the name property.
     *
     * @ORM\Column(type="string")
     */
    private $apellidos;

    /**
     * @var integer Age of the person.
     *
     * @ORM\Column(type="string")
     */
    private $edad;

    /**
     * @var date Date of birth.
     *
     * @ORM\Column(type="date")
     */
    private $birthday;

    /**
     * @var string The identifier property represents any kind of identifier for any kind ofThing, such as ISBNs, GTIN codes, UUIDs etc.
     *
     * @ORM\Column(type="string")
     */
    private $ci;

    /**
     * @var integer A child of the person.
     *
     * @ORM\Column(type="string")
     */
    private $hijos;

    /**
     * @var string Skin color person of the person.
     *
     * @ORM\Column(type="string")
     */
    private $raza;

    /**
     * @var Integer Salary of the person.
     *
     * @ORM\Column(type="string")
     */
    private $salario;

    /**
     * @var String An Organization (or ProgramMembership) to which this Person orOrganization belongs.
     *
     * @ORM\Column(type="string")
     */
    private $cargo;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombres(): ?string
    {
        return $this->nombres;
    }

    public function setNombres(string $nombres): self
    {
        $this->nombres = $nombres;

        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): self
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    public function getEdad(): ?int
    {
        return $this->edad;
    }

    public function setEdad(int $edad): self
    {
        $this->edad = $edad;

        return $this;
    }

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getCi(): ?string
    {
        return $this->ci;
    }

    public function setCi(string $ci): self
    {
        $this->ci = $ci;

        return $this;
    }

    public function getHijos(): ?int
    {
        return $this->hijos;
    }

    public function setHijos(int $hijos): self
    {
        $this->hijos = $hijos;

        return $this;
    }

    public function getRaza(): ?string
    {
        return $this->raza;
    }

    public function setRaza(string $raza): self
    {
        $this->raza = $raza;

        return $this;
    }

    public function getSalario(): ?int
    {
        return $this->salario;
    }

    public function setSalario(int $salario): self
    {
        $this->salario = $salario;

        return $this;
    }

    public function getCargo(): ?string
    {
        return $this->cargo;
    }

    public function setCargo(string $cargo): self
    {
        $this->cargo = $cargo;

        return $this;
    }
}
