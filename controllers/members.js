const fs = require('fs')
const data = require("../data.json")
const { age, date } = require("../utils")

exports.index = function(req, res) {
    return res.render("members/index", { members: data.members })
}

exports.create = function(req, res) {
    return res.render('members/create')
}

exports.post = function(req, res) {

    const keys = Object.keys(req.body)

    for(key of keys) {
        if (req.body[key] == "") {
            return res.send ("Por favor, preencha todos os campos!")              
        }
    }

    birth = Date.parse(req.body.birth)

    let id = 1

    const lastMember = data.members[data.members.length - 1]

    if (lastMember) {
        id = lastMember.id +1
    }

    data.members.push({
        id,
        ...req.body,       
       birth
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Erro ao criar arquivo")

        return res.redirect("/members")
    })

    // return res.send(req.body)
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(members) {
        return id == members.id
    })

    if (!foundMember) {
        return res.send ("Instrutor não encontrado!")
    }

    
    const member = {
        ...foundMember,
        age: age(foundMember.birth),
        birth: date(foundMember.birth).birthDay
    };

    return res.render("members/show", { member })
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(members) {
        return id == members.id
    })

    if (!foundMember) {
        return res.send ("Instrutor não encontrado!")
    }
    
    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }


    return res.render('members/edit', { member })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(members, foundIndex) {
        if( id == members.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) {
        return res.send ("Membro não encontrado!")
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Falha ao salvar arquivo!")

        return res.redirect(`members/${id}`)
    })

}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Erro ao salvar arquivo!")

        return res.redirect("/members")
    })
}